import Sidebar from '../sidebar/Img2ImgSidebar';
import PromptParams from '../params/PromptParams';
import Img2ImgDisplay from '../outputDisplay/Img2ImgDisplay';
import { RootState } from '../../../store/store';
import {
  setPrompt,
  setNegativePrompt,
  setIsNegativePrompt,
  setOutputImgUrls
} from '../../../store/slices/generation/img2ImgSlice';
import { useSelector, useDispatch } from 'react-redux';
import { postImg2ImgGeneration } from '../../../api/generation';
import { convertStringToFile } from '../../../utils/convertStringToFile';
import GenerateButton from '../../common/GenerateButton';

const Img2ImgLayout = () => {
  const dispatch = useDispatch();
  const {
    prompt,
    negativePrompt,
    isNegativePrompt,
    images,
    strength,
    inputPath,
    model,
    scheduler,
    width,
    height,
    samplingSteps,
    guidanceScale,
    seed,
    batchCount,
    batchSize,
    outputPath,
    clipData
  } = useSelector((state: RootState) => state.img2Img);

  const handleNegativePromptChange = () => {
    dispatch(setIsNegativePrompt(!isNegativePrompt));
  };

  const handleGenerate = async () => {
    // Base64 문자열을 파일로 변환
    const files = images.map((base64Img, index) => convertStringToFile(base64Img, `image_${index}.png`));

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
      strength,
      images: files,
      input_path: inputPath
    };

    try {
      // API 호출
      const outputImgUrls = await postImg2ImgGeneration('remote', data);
      console.log('Generated image URLs:', outputImgUrls);
      // 결과 이미지를 상태에 저장
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
          <Img2ImgDisplay />
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
            clipData={clipData}
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

export default Img2ImgLayout;
