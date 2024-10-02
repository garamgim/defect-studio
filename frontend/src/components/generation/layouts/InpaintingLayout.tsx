import Sidebar from '../sidebar/InpaintingSidebar';
import PromptParams from '../params/PromptParams';
import InpaintingDisplay from '../outputDisplay/InpaintingDisplay';
import { useInpaintingParams } from '../../../hooks/generation/params/useInpaintingParams';
import { useDispatch, useSelector } from 'react-redux';
import { postInpaintingGeneration, getClip, getTaskStatus } from '../../../api/generation';
import { convertStringToFile } from '../../../utils/convertStringToFile';
import GenerateButton from '../common/GenerateButton';
import { setIsNegativePrompt, setClipData } from '../../../store/slices/generation/inpaintingSlice';
import { setIsLoading, setTaskId, setOutputImgsCnt } from '../../../store/slices/generation/outputSlice';
import { RootState } from '../../../store/store';
import { message } from 'antd';
import { useEffect, useCallback } from 'react';
import OutputToolbar from '../outputTool/OutputToolbar';
import { useInpaintingOutputs } from '../../../hooks/generation/outputs/useInpaintingOutputs';
import { useClipOutputs } from '../../../hooks/generation/outputs/useClipOutputs';

const InpaintingLayout = () => {
  const dispatch = useDispatch();
  const newGpuNum = useSelector((state: RootState) => state.settings.gpuNum);
  const { params, gpuNum } = useSelector((state: RootState) => state.inpainting);
  const { isLoading, isSidebarVisible } = useInpaintingOutputs();
  const { isLoading: clipIsLoading, taskId: clipTaskId } = useClipOutputs();
  const { prompt, negativePrompt, isNegativePrompt, updatePrompt, updateNegativePrompt } = useInpaintingParams();

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

  const convertBase64ToFileArray = (base64Array: string[], fileType: string) => {
    return base64Array.map((base64Img, index) => convertStringToFile(base64Img, `${fileType}_${index}.png`));
  };

  const handleGenerate = async () => {
    let bgFiles: File[], canvasFiles: File[];

    if (params.uploadImgWithMaskingParams.mode === 'manual') {
      bgFiles = convertBase64ToFileArray(params.uploadImgWithMaskingParams.initImageList, 'image');
      canvasFiles = convertBase64ToFileArray(params.uploadImgWithMaskingParams.maskImageList, 'mask');
      dispatch(
        setOutputImgsCnt({ tab: 'inpainting', value: params.batchParams.batchCount * params.batchParams.batchSize })
      );
    } else {
      const bgFileDataArray = await window.electron.getFilesInFolder(params.uploadImgWithMaskingParams.initInputPath);
      const maskFileDataArray = await window.electron.getFilesInFolder(params.uploadImgWithMaskingParams.maskInputPath);

      // base64 데이터를 Blob으로 변환하고 File 객체로 생성 (배경 이미지 파일)
      bgFiles = bgFileDataArray.map((fileData) => {
        const byteString = atob(fileData.data);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uintArray = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
          uintArray[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([arrayBuffer], { type: fileData.type });
        return new File([blob], fileData.name, { type: fileData.type });
      });

      // base64 데이터를 Blob으로 변환하고 File 객체로 생성 (마스크 이미지 파일)
      canvasFiles = maskFileDataArray.map((fileData) => {
        const byteString = atob(fileData.data);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uintArray = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
          uintArray[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([arrayBuffer], { type: fileData.type });
        return new File([blob], fileData.name, { type: fileData.type });
      });

      dispatch(
        setOutputImgsCnt({
          tab: 'inpainting',
          value: bgFileDataArray.length * params.batchParams.batchCount * params.batchParams.batchSize
        })
      );
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
      init_image_list: bgFiles,
      mask_image_list: canvasFiles,
      init_input_path: params.uploadImgWithMaskingParams.initInputPath,
      mask_input_path: params.uploadImgWithMaskingParams.maskInputPath,
      output_path: '' // 추후 설정
    };

    try {
      dispatch(setIsLoading({ tab: 'inpainting', value: true }));
      const newTaskId = await postInpaintingGeneration('remote', data);

      dispatch(setTaskId({ tab: 'inpainting', value: newTaskId }));
    } catch (error) {
      message.error(`Error generating image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      dispatch(setIsLoading({ tab: 'inpainting', value: false }));
    }
  };

  // Clip아이콘 클릭
  const handleClipClick = useCallback(async () => {
    if (params.uploadImgWithMaskingParams.clipData.length === 0) {
      try {
        if (params.uploadImgWithMaskingParams.initImageList.length > 0) {
          const file = convertStringToFile(params.uploadImgWithMaskingParams.initImageList[0], 'image.png');

          const gpuNumber = gpuNum || 1; // GPU 번호 설정 간소화

          const clipData = {
            gpu_device: gpuNumber,
            image_list: [file]
          };
          const newClipId = await getClip(clipData);
          dispatch(setIsLoading({ tab: 'clip', value: true }));
          dispatch(setTaskId({ tab: 'clip', value: newClipId }));
          console.log('clip 갱신: ', newClipId);
        } else {
          console.error('No image available for clip generation');
        }
      } catch (error) {
        message.error(`Error generating clip data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        dispatch(setIsLoading({ tab: 'clip', value: false }));
      }
    }
  }, [
    params.uploadImgWithMaskingParams.clipData.length,
    params.uploadImgWithMaskingParams.initImageList,
    gpuNum,
    dispatch
  ]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    const fetchTaskStatus = async () => {
      console.log(clipIsLoading, clipTaskId);
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

  const handleNegativePromptChange = () => {
    dispatch(setIsNegativePrompt(!isNegativePrompt));
  };

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
            <InpaintingDisplay />
          </div>
          <OutputToolbar type="inpainting" />
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
              clipData={
                params.uploadImgWithMaskingParams.mode === 'manual' ? params.uploadImgWithMaskingParams.clipData : []
              }
              handleClipClick={params.uploadImgWithMaskingParams.mode === 'manual' ? handleClipClick : undefined}
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

export default InpaintingLayout;
