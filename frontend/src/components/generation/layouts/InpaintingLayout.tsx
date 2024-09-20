import Sidebar from '../sidebar/InpaintingSidebar';
import PromptParams from '../params/PromptParams';
import InpaintingDisplay from '../outputDisplay/InpaintingDisplay';
import { RootState } from '../../../store/store';
import {
  setPrompt,
  setNegativePrompt,
  setIsNegativePrompt,
  setOutputImgUrls,
  setClipData,
  setIsLoading,
  setUploadImgsCount
} from '../../../store/slices/generation/inpaintingSlice';
import { useSelector, useDispatch } from 'react-redux';
import { postInpaintingGeneration } from '../../../api/generation';
import { convertStringToFile } from '../../../utils/convertStringToFile';
import GenerateButton from '../../common/GenerateButton';
import { getClip } from '../../../api/generation';

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
    samplingSteps,
    guidanceScale,
    seed,
    batchCount,
    batchSize,
    outputPath,
    clipData,
    mode,
    isLoading
  } = useSelector((state: RootState) => state.inpainting);

  const handleNegativePromptChange = () => {
    dispatch(setIsNegativePrompt(!isNegativePrompt));
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
      num_inference_steps: samplingSteps,
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
    // clipData가 빈 배열일 때만 getClip 실행
    if (clipData.length === 0) {
      try {
        if (initImageList.length > 0) {
          const file = convertStringToFile(initImageList[0], 'image.png');

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
    <div className="flex h-[calc(100vh-60px)] pt-4 pb-6">
      {/* 사이드바 */}
      <div className="w-[360px] pl-8 h-full hidden md:block">
        <Sidebar />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col px-8 w-full h-full">
<<<<<<< HEAD
        <div className="flex-1 mb-8 overflow-y-auto custom-scrollbar p-4">
          <InpaintingDisplay />
        </div>

        <div className="w-full flex-none">
          <PromptParams
            prompt={prompt}
            negativePrompt={negativePrompt}
            isNegativePrompt={isNegativePrompt}
            setPrompt={(value) => dispatch(setPrompt(value))}
            setNegativePrompt={(value) => dispatch(setNegativePrompt(value))}
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
=======
        <div className="flex-1 mb-8 overflow-y-auto custom-scrollbar p-4 border">
          {/* ImageDisplay가 남은 높이를 차지하도록 flex-1 적용 */}
          <InpaintingDisplay />
        </div>
        <div className="w-full flex-none">
          {/* Prompt는 고정된 높이를 가짐 */}
          <PromptParams />
        </div>
      </div>
>>>>>>> feature/fe/42-token-page-ui
    </div>
  );
};

export default InpaintingLayout;
