import Sidebar from '../sidebar/InpaintingSidebar';
import PromptParams from '../params/PromptParams';
import InpaintingDisplay from '../outputDisplay/InpaintingDisplay';
import { useInpaintingParams } from '../../../hooks/generation/params/useInpaintingParams';
import { useDispatch, useSelector } from 'react-redux';
import { postInpaintingGeneration, getClip, getTaskStatus } from '../../../api/generation';
import { convertStringToFile } from '../../../utils/convertStringToFile';
import GenerateButton from '../common/GenerateButton';
import { setClipData, setIsNegativePrompt } from '../../../store/slices/generation/inpaintingSlice';
import {
  setIsLoading,
  setTaskId,
  setOutputImgsUrl,
  setOutputImgsCnt,
  setAllOutputsInfo,
  setIsCheckedOutput
} from '../../../store/slices/generation/outputSlice';
import { RootState } from '../../../store/store';
import { message } from 'antd';
import { useEffect } from 'react';
import OutputToolbar from '../outputTool/OutputToolbar';
import { useInpaintingOutputs } from '../../../hooks/generation/outputs/useInpaintingOutputs';

const InpaintingLayout = () => {
  const dispatch = useDispatch();
  const { params, gpuNum } = useSelector((state: RootState) => state.inpainting);
  const { isLoading, taskId, output, allOutputs, isSidebarVisible } = useInpaintingOutputs();
  const { prompt, negativePrompt, isNegativePrompt, updatePrompt, updateNegativePrompt } = useInpaintingParams();

  // 파일 변환 로직을 함수로 분리하여 중복 제거
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

      bgFiles = bgFileDataArray.map(({ data, name }) => convertStringToFile(data, name));
      canvasFiles = maskFileDataArray.map(({ data, name }) => convertStringToFile(data, name));

      dispatch(
        setOutputImgsCnt({
          tab: 'inpainting',
          value: bgFileDataArray.length * params.batchParams.batchCount * params.batchParams.batchSize
        })
      );
    }

    const gpuNumber = gpuNum || 1; // GPU 번호 설정 간소화

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

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    const fetchTaskStatus = async () => {
      if (isLoading && taskId) {
        try {
          const response = await getTaskStatus(taskId);
          if (response.task_status === 'SUCCESS') {
            clearInterval(intervalId); // 성공 시 상태 확인 중지
            dispatch(setOutputImgsUrl({ tab: 'inpainting', value: response.result_data }));

            const outputsCnt = allOutputs.outputsCnt + output.imgsCnt;
            const outputsInfo = [
              {
                id: response.result_data_log.id,
                imgsUrl: response.result_data,
                prompt: response.result_data_log.prompt
              },
              ...allOutputs.outputsInfo
            ];
            dispatch(setAllOutputsInfo({ tab: 'inpainting', outputsCnt, outputsInfo }));

            dispatch(setIsLoading({ tab: 'inpainting', value: false }));
            dispatch(setIsCheckedOutput({ tab: 'inpainting', value: false }));
            dispatch(setTaskId({ tab: 'inpainting', value: null }));
          }
        } catch (error) {
          console.error('Failed to get task status:', error);
          dispatch(setIsLoading({ tab: 'inpainting', value: false }));
          clearInterval(intervalId);
        }
      }
    };

    if (taskId) {
      fetchTaskStatus();
      intervalId = setInterval(fetchTaskStatus, 1000); // 1초마다 상태 확인
    }

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 정리
  }, [taskId, isLoading, dispatch, allOutputs.outputsCnt, output.imgsCnt, allOutputs.outputsInfo]);

  // Clip 아이콘 클릭
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
