import { useCallback, useEffect } from 'react';
import { message } from 'antd';
import Sidebar from '../sidebar/Txt2ImgSidebar';
import PromptParams from '../params/PromptParams';
import Txt2ImgDisplay from '../outputDisplay/Txt2ImgDisplay';
import { useDispatch, useSelector } from 'react-redux';
import { setIsNegativePrompt } from '../../../store/slices/generation/txt2ImgSlice';
import { useTxt2ImgParams } from '../../../hooks/generation/params/useTxt2ImgParams';
import { useTxt2ImgOutputs } from '../../../hooks/generation/outputs/useTxt2ImgOutputs';
import GenerateButton from '../common/GenerateButton';
import { postTxt2ImgGeneration } from '../../../api/generation';
import { RootState } from '../../../store/store';
import OutputToolbar from '../outputTool/outputToolbar';
import { setIsLoading, setOutputImgsCnt, setTaskId } from '../../../store/slices/generation/outputSlice';

const Txt2ImgLayout = () => {
  const dispatch = useDispatch();
  const { params, gpuNum } = useSelector((state: RootState) => state.txt2Img);
  const { isLoading, isSidebarVisible } = useTxt2ImgOutputs();
  const { prompt, negativePrompt, isNegativePrompt, updatePrompt, updateNegativePrompt } = useTxt2ImgParams();

  const handleNegativePromptChange = useCallback(() => {
    dispatch(setIsNegativePrompt(!isNegativePrompt));
  }, [isNegativePrompt, dispatch]);

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

  const handleGenerate = async () => {
    const gpuNumber = gpuNum || 1; // gpuNum이 없으면 기본값 1 사용
    console.log('pp', params.promptParams.prompt);

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
      dispatch(setIsLoading({ tab: 'txt2Img', value: true }));
      const newTaskId = await postTxt2ImgGeneration('remote', data);

      const imgsCnt = params.batchParams.batchCount * params.batchParams.batchSize;
      dispatch(setOutputImgsCnt({ tab: 'txt2Img', value: imgsCnt }));

      dispatch(setTaskId({ tab: 'txt2Img', value: newTaskId }));
    } catch (error) {
      message.error(`Error generating image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      dispatch(setIsLoading({ tab: 'txt2Img', value: false }));
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
            <Txt2ImgDisplay />
          </div>
          <OutputToolbar type="txt2Img" />
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
