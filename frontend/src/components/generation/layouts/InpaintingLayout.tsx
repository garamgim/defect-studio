import Sidebar from '../sidebar/InpaintingSidebar';
import PromptParams from '../params/PromptParams';
import InpaintingDisplay from '../outputDisplay/InpaintingDisplay';
import { useInpaintingParams } from '../../../hooks/generation/useInpaintingParams';
import { useDispatch, useSelector } from 'react-redux';
import { postInpaintingGeneration, getClip, getTaskStatus } from '../../../api/generation';
import { convertStringToFile } from '../../../utils/convertStringToFile';
import GenerateButton from '../../common/GenerateButton';
import {
  setClipData,
  setIsLoading,
  setTaskId,
  setOutputImgsUrl,
  setOutputImgsCnt,
  setAllOutputsInfo,
  setselectedImgs,
  setIsSidebarVisible,
  setAllSelected
} from '../../../store/slices/generation/inpaintingSlice';
import { RootState } from '../../../store/store';
import { message } from 'antd';
import { useEffect } from 'react';
import OutputToolbar from '../outputTool/outputToolbar';

const InpaintingLayout = () => {
  const dispatch = useDispatch();
  const { params, isLoading, gpuNum, taskId, allOutputs, output, selectedImgs, isSidebarVisible, allSelected } =
    useSelector((state: RootState) => state.inpainting);
  const { prompt, negativePrompt, isNegativePrompt, updatePrompt, updateNegativePrompt } = useInpaintingParams();

  const handleNegativePromptChange = () => {
    !isNegativePrompt;
  };

  let bgFiles;
  let canvasFiles;

  const handleGenerate = async () => {
    if (params.uploadImgWithMaskingParams.mode === 'manual') {
      bgFiles = params.uploadImgWithMaskingParams.initImageList.map((base64Img, index) =>
        convertStringToFile(base64Img, `image_${index}.png`)
      );
      canvasFiles = params.uploadImgWithMaskingParams.maskImageList.map((base64Img, index) =>
        convertStringToFile(base64Img, `image_${index}.png`)
      );
      dispatch(setOutputImgsCnt(params.batchParams.batchCount * params.batchParams.batchSize));
    } else {
      const bgFileDataArray = await window.electron.getFilesInFolder(params.uploadImgWithMaskingParams.initInputPath);
      const maskFileDataArray = await window.electron.getFilesInFolder(params.uploadImgWithMaskingParams.maskInputPath);
      dispatch(setOutputImgsCnt(bgFileDataArray.length * params.batchParams.batchCount * params.batchParams.batchSize));

      // base64 데이터를 Blob으로 변환하고 File 객체로 생성
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
    }

    let gpuNumber: number;
    if (gpuNum) {
      gpuNumber = gpuNum;
    } else {
      gpuNumber = 1; // settings 기본값 가져오기
    }

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
      input_path: params.uploadImgWithMaskingParams.initInputPath,
      init_image_list: bgFiles,
      mask_image_list: canvasFiles,
      init_input_path: '',
      mask_input_path: '',
      output_path: '' // 추후 settings 페이지 경로 넣을 예정
    };

    try {
      dispatch(setIsLoading(true));
      const newTaskId = await postInpaintingGeneration('remote', data);
      console.log('테스크아이디: ', newTaskId);

      const imgsCnt = params.batchParams.batchCount * params.batchParams.batchSize;
      dispatch(setOutputImgsCnt(imgsCnt));

      dispatch(setTaskId(newTaskId));
    } catch (error) {
      if (error instanceof Error) {
        message.error(`Error generating image: ${error.message}`);
      } else {
        message.error('An unknown error occurred');
      }

      dispatch(setIsLoading(false));
    }
  };

  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined;

    const fetchTaskStatus = async () => {
      try {
        // 로딩 중이고 taskId가 있을 경우에만 상태 확인
        if (isLoading && taskId) {
          const response = await getTaskStatus(taskId);
          console.log(response.data);
          if (response.status === 'SUCCESS') {
            clearInterval(intervalId);
            dispatch(setOutputImgsUrl(response.data));

            const outputsCnt = allOutputs.outputsCnt + output.imgsCnt;
            const outputsInfo = [{ id: taskId, imgsUrl: response.data, prompt: '' }, ...allOutputs.outputsInfo];
            dispatch(setAllOutputsInfo({ outputsCnt, outputsInfo }));

            dispatch(setIsLoading(false));
            dispatch(setTaskId(null));
          } else if (response.status === 'FAILED') {
            dispatch(setIsLoading(false));
            clearInterval(intervalId);
            message.error('Image generation failed');
          }
        }
      } catch (error) {
        console.error('Failed to get task-status:', error);
        dispatch(setIsLoading(false));
        clearInterval(intervalId); // 오류 발생 시 주기적 호출 중지
      }
    };

    if (taskId) {
      fetchTaskStatus(); // 처음 상태 확인
      intervalId = setInterval(fetchTaskStatus, 1000); // 1초마다 상태 확인
    }

    // 컴포넌트가 언마운트되거나 taskId가 변경될 때 setInterval 정리
    return () => clearInterval(intervalId);
  }, [allOutputs.outputsCnt, allOutputs.outputsInfo, dispatch, isLoading, output.imgsCnt, taskId]);

  // Clip아이콘 클릭
  const handleClipClick = async () => {
    if (params.uploadImgWithMaskingParams.clipData.length === 0) {
      try {
        if (params.uploadImgWithMaskingParams.initImageList.length > 0) {
          const file = convertStringToFile(params.uploadImgWithMaskingParams.initImageList[0], 'image.png');
          const generatedPrompts = await getClip([file]);
          dispatch(setClipData(generatedPrompts));
        } else {
          console.error('No image available for clip generation');
        }
      } catch (error) {
        console.error('Error generating clip data:', error);
      }
    }
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
          <OutputToolbar
            selectedImgs={selectedImgs}
            isSidebarVisible={isSidebarVisible}
            allSelected={allSelected}
            setAllSelected={(value: boolean) => dispatch(setAllSelected(value))}
            setIsSidebarVisible={(value: boolean) => dispatch(setIsSidebarVisible(value))}
            setselectedImgs={(value: string[]) => dispatch(setselectedImgs(value))}
          />
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
