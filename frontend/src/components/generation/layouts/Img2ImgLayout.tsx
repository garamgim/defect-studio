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
    clipData,
    mode
  } = useSelector((state: RootState) => state.img2Img);

  const handleNegativePromptChange = () => {
    dispatch(setIsNegativePrompt(!isNegativePrompt));
  };

  let files;

  const handleGenerate = async () => {
    if (mode === 'manual') {
      files = images.map((base64Img, index) => convertStringToFile(base64Img, `image_${index}.png`));
    } else {
      const fileDataArray = await window.electron.getFilesInFolder(inputPath);

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
      const outputImgUrls = await postImg2ImgGeneration('remote', data);
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
