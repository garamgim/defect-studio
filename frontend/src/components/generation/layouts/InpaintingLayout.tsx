import Sidebar from '../sidebar/InpaintingSidebar';
import PromptParams from '../params/PromptParams';
import InpaintingDisplay from '../outputDisplay/InpaintingDisplay';
import { useInpaintingParams } from '../../../hooks/generation/useInpaintingParams';
import { useDispatch } from 'react-redux';
import { postInpaintingGeneration, getClip } from '../../../api/generation';
import { convertStringToFile } from '../../../utils/convertStringToFile';
import GenerateButton from '../../common/GenerateButton';
import {
  setClipData,
  setIsLoading,
  setOutputImgUrls,
  setUploadImgsCount
} from '../../../store/slices/generation/inpaintingSlice';

const InpaintingLayout = () => {
  const dispatch = useDispatch();
  const {
    prompt,
    negativePrompt,
    isNegativePrompt,
    strength,
    initImageList,
    maskImageList,
    initInputPath,
    maskInputPath,
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
    handleSetNegativePrompt,
    handleSetIsNegativePrompt
  } = useInpaintingParams();

  const handleNegativePromptChange = () => {
    handleSetIsNegativePrompt(!isNegativePrompt);
  };

  let bgFiles;
  let canvasFiles;

  const handleGenerate = async () => {
    if (mode === 'manual') {
      bgFiles = initImageList.map((base64Img, index) => convertStringToFile(base64Img, `image_${index}.png`));
      canvasFiles = maskImageList.map((base64Img, index) => convertStringToFile(base64Img, `image_${index}.png`));
      dispatch(setUploadImgsCount(batchCount * batchSize));
    } else {
      const bgFileDataArray = await window.electron.getFilesInFolder(initInputPath);
      const maskFileDataArray = await window.electron.getFilesInFolder(maskInputPath);
      dispatch(setUploadImgsCount(bgFileDataArray.length * batchCount * batchSize));

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
      init_image_list: bgFiles,
      mask_image_list: canvasFiles,
      init_input_path: initInputPath,
      mask_input_path: maskInputPath
    };

    try {
      dispatch(setIsLoading(true));
      const outputImgUrls = await postInpaintingGeneration('remote', data);
      dispatch(setOutputImgUrls(outputImgUrls));
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  // Clip아이콘 클릭
  const handleClipClick = async () => {
    if (clipData.length === 0) {
      try {
        if (initImageList.length > 0) {
          const file = convertStringToFile(initImageList[0], 'image.png');
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
      <div className="w-[360px] pl-8 h-full hidden md:block">
        <Sidebar />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col px-8 w-full h-full">
        <div className="flex-1 mb-8 overflow-y-auto custom-scrollbar p-4">
          <InpaintingDisplay />
        </div>

        <div className="w-full flex-none">
          <PromptParams
            prompt={prompt}
            negativePrompt={negativePrompt}
            isNegativePrompt={isNegativePrompt}
            setPrompt={handleSetPrompt}
            setNegativePrompt={handleSetNegativePrompt}
            handleNegativePromptChange={handleNegativePromptChange}
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

export default InpaintingLayout;
