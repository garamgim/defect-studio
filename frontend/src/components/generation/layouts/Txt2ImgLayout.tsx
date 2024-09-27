import { useCallback, useEffect } from 'react';
import { message } from 'antd';
import Sidebar from '../sidebar/Txt2ImgSidebar';
import PromptParams from '../params/PromptParams';
import Txt2ImgDisplay from '../outputDisplay/Txt2ImgDisplay';
import { useDispatch, useSelector } from 'react-redux';
import {
  setIsNegativePrompt,
  setIsLoading,
  setTaskId,
  setOutputImgsUrl,
  setOutputImgsCnt,
  setAllOutputsInfo,
  setSelectedImages,
  setIsSidebarVisible,
  setAllSelected
} from '../../../store/slices/generation/txt2ImgSlice';
import { useTxt2ImgParams } from '../../../hooks/generation/useTxt2ImgParams';
import GenerateButton from '../../common/GenerateButton';
import { postTxt2ImgGeneration, getTaskStatus } from '../../../api/generation';
import { RootState } from '../../../store/store';
import OutputToolbar from '../outputTool/outputToolbar';

const Txt2ImgLayout = () => {
  const dispatch = useDispatch();
  const { params, isLoading, taskId, gpuNum, output, allOutputs, selectedImages, isSidebarVisible, allSelected } =
    useSelector((state: RootState) => state.txt2Img);
  const { prompt, negativePrompt, isNegativePrompt, updatePrompt, updateNegativePrompt } = useTxt2ImgParams();

  const handleNegativePromptChange = useCallback(() => {
    dispatch(setIsNegativePrompt(!isNegativePrompt));
  }, [isNegativePrompt, dispatch]);

  const handleGenerate = async () => {
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
      output_path: '' // 추후 settings 페이지 경로 넣을 예정
    };

    try {
      dispatch(setIsLoading(true));
      const newTaskId = await postTxt2ImgGeneration('remote', data);

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
  }, [
    taskId,
    params.batchParams.batchCount,
    params.batchParams.batchSize,
    isLoading,
    allOutputs.outputsCnt,
    allOutputs.outputsInfo,
    dispatch,
    output.imgsCnt
  ]);

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
            <Txt2ImgDisplay />
          </div>
          <OutputToolbar
            selectedImages={selectedImages}
            isSidebarVisible={isSidebarVisible}
            allSelected={allSelected}
            setAllSelected={(value: boolean) => dispatch(setAllSelected(value))}
            setIsSidebarVisible={(value: boolean) => dispatch(setIsSidebarVisible(value))}
            setSelectedImages={(value: string[]) => dispatch(setSelectedImages(value))}
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

export default Txt2ImgLayout;
