import Sidebar from '../sidebar/Img2ImgSidebar';
import PromptParams from '../params/PromptParams';
import Img2ImgDisplay from '../outputDisplay/Img2ImgDisplay';
import { setIsNegativePrompt, setClipData } from '../../../store/slices/generation/img2ImgSlice';
import { setIsLoading, setTaskId, setOutputImgsCnt } from '../../../store/slices/generation/outputSlice';
import { useDispatch, useSelector } from 'react-redux';
import { postImg2ImgGeneration, getClip, getTaskStatus } from '../../../api/generation';
import { convertStringToFile } from '../../../utils/convertStringToFile';
import GenerateButton from '../common/GenerateButton';
import { useImg2ImgParams } from '../../../hooks/generation/params/useImg2ImgParams';
import { RootState } from '../../../store/store';
import { message } from 'antd';
import OutputToolbar from '../outputTool/OutputToolbar';
import { useImg2ImgOutputs } from '../../../hooks/generation/outputs/useImg2ImgOutputs';
import { useEffect, useCallback } from 'react';
import { useClipOutputs } from '@/hooks/generation/outputs/useClipOutputs';

const Img2ImgLayout = () => {
  const dispatch = useDispatch();
  const { params, gpuNum } = useSelector((state: RootState) => state.img2Img);
  const newGpuNum = useSelector((state: RootState) => state.settings.gpuNum);
  const { isLoading, isSidebarVisible } = useImg2ImgOutputs();
  const { isLoading: clipIsLoading, taskId: clipTaskId } = useClipOutputs();
  const { prompt, negativePrompt, isNegativePrompt, updatePrompt, updateNegativePrompt } = useImg2ImgParams();

  const handleNegativePromptChange = () => {
    dispatch(setIsNegativePrompt(!isNegativePrompt));
  };

  // Ctrl + Enter 키를 감지하여 handleGenerate 실행
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'Enter') {
        handleGenerate();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [prompt]);

  let files;

  const handleGenerate = async () => {
    if (params.uploadImgParams.mode === 'manual') {
      files = params.uploadImgParams.imageList.map((base64Img, index) =>
        convertStringToFile(base64Img, `image_${index}.png`)
      );
      dispatch(
        setOutputImgsCnt({ tab: 'img2Img', value: params.batchParams.batchCount * params.batchParams.batchSize })
      );
    } else {
      const fileDataArray = await window.electron.getFilesInFolder(params.uploadImgParams.inputPath);
      dispatch(
        setOutputImgsCnt({
          tab: 'img2Img',
          value: fileDataArray.length * params.batchParams.batchCount * params.batchParams.batchSize
        })
      );

      // base64 데이터를 Blob으로 변환하고 File 객체로 생성
      files = fileDataArray.map((fileData) => {
        const byteString = atob(fileData.data);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uintArray = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
          uintArray[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([arrayBuffer], { type: fileData.type });
        return new File([blob], fileData.name, { type: fileData.type });
      });
    }

    const gpuNumber = gpuNum || newGpuNum;

    const data = {
      gpu_device: gpuNumber,
      model: params.modelParams.model,
      scheduler: params.samplingParams.scheduler,
      prompt: params.promptParams.prompt,
      negative_prompt: params.promptParams.negativePrompt,
      width: params.imgDimensionParams.width,
      height: params.imgDimensionParams.height,
      num_inference_steps: params.samplingParams.numInferenceSteps,
      guidance_scale: params.guidanceParams.guidanceScale,
      seed: params.seedParams.seed,
      batch_count: params.batchParams.batchCount,
      batch_size: params.batchParams.batchSize,
      strength: params.strengthParams.strength,
      image_list: files,
      input_path: params.uploadImgParams.inputPath,
      output_path: '' // 추후 settings 페이지 경로 넣을 예정
    };

    try {
      dispatch(setIsLoading({ tab: 'img2Img', value: true }));
      const newTaskId = await postImg2ImgGeneration('remote', data);

      dispatch(setTaskId({ tab: 'img2Img', value: newTaskId }));
    } catch (error) {
      message.error(`Error generating image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      dispatch(setIsLoading({ tab: 'img2Img', value: false }));
    }
  };

  // Clip아이콘 클릭
  const handleClipClick = useCallback(async () => {
    if (params.uploadImgParams.clipData.length === 0) {
      try {
        if (params.uploadImgParams.imageList.length > 0) {
          const file = convertStringToFile(params.uploadImgParams.imageList[0], 'image.png');

          const gpuNumber = gpuNum || 1; // GPU 번호 설정 간소화

          const clipData = {
            gpu_device: gpuNumber,
            image_list: [file]
          };
          const newClipId = await getClip(clipData);
          dispatch(setIsLoading({ tab: 'clip', value: true }));
          dispatch(setTaskId({ tab: 'clip', value: newClipId }));
        } else {
          console.error('No image available for clip generation');
        }
      } catch (error) {
        message.error(`Error generating clip data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        dispatch(setIsLoading({ tab: 'clip', value: false }));
      }
    }
  }, [params.uploadImgParams.clipData.length, params.uploadImgParams.imageList, gpuNum, dispatch]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    const fetchTaskStatus = async () => {
      if (clipIsLoading && clipTaskId) {
        try {
          const response = await getTaskStatus(clipTaskId);
          if (response.task_status === 'SUCCESS') {
            clearInterval(intervalId); // 성공 시 상태 확인 중지
            dispatch(setClipData(response.result_data));

            dispatch(setIsLoading({ tab: 'clip', value: false }));
            dispatch(setTaskId({ tab: 'clip', value: null }));
          }
        } catch (error) {
          console.error('Failed to get task status:', error);
          dispatch(setIsLoading({ tab: 'clip', value: false }));
          clearInterval(intervalId);
        }
      }
    };

    if (clipTaskId) {
      fetchTaskStatus();
      intervalId = setInterval(fetchTaskStatus, 1000); // 1초마다 상태 확인
    }

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 정리
  }, [isLoading, dispatch, clipIsLoading, clipTaskId]);

  return (
    <div className="flex h-full pt-4 pb-6">
      {/* 사이드바 */}
      {isSidebarVisible && (
        <div className="w-[360px] pl-8 h-full hidden md:block">
          <Sidebar />
        </div>
      )}

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col px-8 w-full h-full">
        <div className="flex-1 overflow-y-auto custom-scrollbar py-4 pl-4 flex">
          {/* 이미지 디스플레이 */}
          <div className="flex-1">
            <Img2ImgDisplay />
          </div>
          <OutputToolbar type="img2Img" />
        </div>

        {/* 프롬프트 영역 */}
        {isSidebarVisible && (
          <div className="w-full flex-none mt-6">
            <PromptParams
              prompt={prompt}
              negativePrompt={negativePrompt}
              updatePrompt={updatePrompt}
              updateNegativePrompt={updateNegativePrompt}
              isNegativePrompt={isNegativePrompt}
              handleNegativePromptChange={handleNegativePromptChange}
              // 메뉴얼 모드일 때만 props로 전달(batch에서는 clip실행 안함)
              clipData={params.uploadImgParams.mode === 'manual' ? params.uploadImgParams.clipData : []}
              handleClipClick={params.uploadImgParams.mode === 'manual' ? handleClipClick : undefined}
            />
          </div>
        )}
      </div>

      {/* Generate 버튼 */}
      {isSidebarVisible && (
        <div className="fixed bottom-[50px] right-[56px]">
          <GenerateButton onClick={handleGenerate} disabled={isLoading} />
        </div>
      )}
    </div>
  );
};

export default Img2ImgLayout;
