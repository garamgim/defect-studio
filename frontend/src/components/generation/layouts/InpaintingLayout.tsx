import Sidebar from '../sidebar/InpaintingSidebar';
import PromptParams from '../params/PromptParams';
import InpaintingDisplay from '../outputDisplay/InpaintingDisplay';
import { useInpaintingParams } from '../../../hooks/generation/useInpaintingParams';
import { useDispatch, useSelector } from 'react-redux';
import { postInpaintingGeneration, getClip } from '../../../api/generation';
import { convertStringToFile } from '../../../utils/convertStringToFile';
import GenerateButton from '../../common/GenerateButton';
import {
  setClipData,
  setIsLoading,
  setOutputImgs,
  setProcessedImgsCnt
} from '../../../store/slices/generation/inpaintingSlice';
import { RootState } from '../../../store/store';

const InpaintingLayout = () => {
  const dispatch = useDispatch();
  const { params, isLoading } = useSelector((state: RootState) => state.inpainting);
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
      dispatch(setProcessedImgsCnt(params.batchParams.batchCount * params.batchParams.batchSize));
    } else {
      const bgFileDataArray = await window.electron.getFilesInFolder(params.uploadImgWithMaskingParams.initInputPath);
      const maskFileDataArray = await window.electron.getFilesInFolder(params.uploadImgWithMaskingParams.maskInputPath);
      dispatch(
        setProcessedImgsCnt(bgFileDataArray.length * params.batchParams.batchCount * params.batchParams.batchSize)
      );

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
      const outputImgUrls = await postInpaintingGeneration('remote', data);
      dispatch(setOutputImgs(outputImgUrls));
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

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
      </div>

      {/* Generate 버튼 */}
      <div className="fixed bottom-[50px] right-[56px]">
        <GenerateButton onClick={handleGenerate} disabled={isLoading} />
      </div>
    </div>
  );
};

export default InpaintingLayout;
