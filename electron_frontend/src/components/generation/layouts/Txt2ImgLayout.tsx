import Sidebar from '../sidebar/Txt2ImgSidebar';
import PromptParams from '../params/PromptParams';
import Txt2ImgDisplay from '../outputDisplay/Txt2ImgDisplay';
import { useDispatch, useSelector } from 'react-redux';
import { setPrompt, setNegativePrompt, setIsNegativePrompt, setOutputImgUrls } from '../../../store/slices/generation/txt2ImgSlice';
import { postTxt2ImgGeneration } from '../../../api/generation';  // API 호출 함수 가져오기
import { RootState } from '../../../store/store';
import GenerateButton from '../../common/GenerateButton';

const Txt2ImgLayout = () => {
  const dispatch = useDispatch();
  const { prompt, negativePrompt, isNegativePrompt, model, scheduler, width, height, samplingSteps, guidanceScale, seed, batchCount, batchSize, outputPath } = useSelector((state: RootState) => state.txt2Img);

  const handleNegativePromptChange = () => {
    dispatch(setIsNegativePrompt(!isNegativePrompt));
  };

  const handleGenerate = async () => {
    const data = {
      model,
      scheduler,
      prompt,
      negative_prompt: negativePrompt,
      width,
      height,
      num_inference_steps: samplingSteps,
      guidance_scale: guidanceScale,
      seed,
      batch_count: batchCount,
      batch_size: batchSize,
      output_path: outputPath,
    };

    try {
      const outputImgUrls = await postTxt2ImgGeneration('remote', data);
      console.log('Generated image URLs:', outputImgUrls);
      
      dispatch(setOutputImgUrls(outputImgUrls));
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-60px)] pt-4 pb-6">
      {/* 사이드바 */}
      <div className="w-[360px] pl-8 pr-4 h-full hidden md:block">
        <Sidebar />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col px-8 w-full h-full">
        <div className="flex-1 mb-8 overflow-y-auto custom-scrollbar p-4">
          <Txt2ImgDisplay />
        </div>

        <div className="w-full flex-none">
          <PromptParams
            prompt={prompt}
            negativePrompt={negativePrompt}
            setPrompt={(value) => {
              dispatch(setPrompt(value));
            }}
            setNegativePrompt={(value) => {
              dispatch(setNegativePrompt(value));
            }}
            isNegativePrompt={isNegativePrompt}
            handleNegativePromptChange={handleNegativePromptChange}
          />
        </div>
      </div>

      {/* Generate 버튼 */}
      <div className="fixed bottom-[50px] right-[56px]">
        <GenerateButton onClick={handleGenerate} />  
      </div>
    </div>
  );
};

export default Txt2ImgLayout;
