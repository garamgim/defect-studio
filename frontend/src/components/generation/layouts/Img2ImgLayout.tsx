import Sidebar from '../sidebar/Img2ImgSidebar';
import PromptParams from '../params/PromptParams';
import Img2ImgDisplay from '../outputDisplay/Img2ImgDisplay';
import {
  setIsNegativePrompt,
  setOutputImgUrls,
  setIsLoading,
  setUploadImgsCount,
  setClipData
} from '../../../store/slices/generation/img2ImgSlice';
import { useDispatch } from 'react-redux';
import { postImg2ImgGeneration } from '../../../api/generation';
import { convertStringToFile } from '../../../utils/convertStringToFile';
import GenerateButton from '../../common/GenerateButton';
import { getClip } from '../../../api/generation';
import { useImg2ImgParams } from '../../../hooks/generation/useImg2ImgParams';

const Img2ImgLayout = () => {
  const dispatch = useDispatch();
  const {
    prompt,
    negativePrompt,
    isNegativePrompt,
    imageList,
    strength,
    inputPath,
    model,
    scheduler,
    width,
    height,
    numInferenceSteps,
    guidanceScale,
    seed,
    batchCount,
    batchSize,
    outputPath,
    clipData,
    mode,
    isLoading,
    handleSetPrompt,
    handleSetNegativePrompt
  } = useImg2ImgParams();

  const handleNegativePromptChange = () => {
    dispatch(setIsNegativePrompt(!isNegativePrompt));
  };

  let files;

  const handleGenerate = async () => {
    if (mode === 'manual') {
      files = imageList.map((base64Img, index) => convertStringToFile(base64Img, `image_${index}.png`));
      dispatch(setUploadImgsCount(batchCount * batchSize));
      console.log('파일: ', files);
    } else {
      const fileDataArray = await window.electron.getFilesInFolder(inputPath);
      dispatch(setUploadImgsCount(fileDataArray.length * batchCount * batchSize));

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
      num_inference_steps: numInferenceSteps,
      guidance_scale: guidanceScale,
      seed,
      batch_count: batchCount,
      batch_size: batchSize,
      output_path: outputPath,
      strength,
      image_list: files,
      input_path: inputPath
    };

    try {
      dispatch(setIsLoading(true));
      const outputImgUrls = await postImg2ImgGeneration('remote', data);
      dispatch(setOutputImgUrls(outputImgUrls));
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  // Clip아이콘 클릭
  const handleClipClick = async () => {
    // clipData가 빈 배열일 때만 getClip 실행
    if (clipData.length === 0) {
      try {
        if (imageList.length > 0) {
          const file = convertStringToFile(imageList[0], 'image.png');

          const generatedPrompts = await getClip([file]);
          dispatch(setClipData(generatedPrompts));
          console.log('clip 갱신: ', clipData);
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
      <div className="w-[360px] pl-8 h-full hidden md:block">
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
            setPrompt={handleSetPrompt}
            setNegativePrompt={handleSetNegativePrompt}
            isNegativePrompt={isNegativePrompt}
            handleNegativePromptChange={handleNegativePromptChange}
            // 메뉴얼 모드일 때만 props로 전달(batch에서는 clip실행 안함)
            clipData={mode === 'manual' ? clipData : []}
            handleClipClick={mode === 'manual' ? handleClipClick : undefined}
          />
        </div>
      </div>

      {/* Generate 버튼 */}
      <div className="fixed bottom-[50px] right-[56px]">
        <GenerateButton onClick={handleGenerate} disabled={isLoading} />
      </div>
    </div>
  );
};

export default Img2ImgLayout;
