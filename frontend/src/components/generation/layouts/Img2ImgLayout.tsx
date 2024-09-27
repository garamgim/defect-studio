import Sidebar from '../sidebar/Img2ImgSidebar';
import PromptParams from '../params/PromptParams';
import Img2ImgDisplay from '../outputDisplay/Img2ImgDisplay';
import {
  setIsNegativePrompt,
  setIsLoading,
  setTaskId,
  setOutputImgsUrl,
  setOutputImgsCnt,
  resetOutputs,
  setAllOutputsInfo,
  setClipData
} from '../../../store/slices/generation/img2ImgSlice';
import { useDispatch, useSelector } from 'react-redux';
import { postImg2ImgGeneration } from '../../../api/generation';
import { convertStringToFile } from '../../../utils/convertStringToFile';
import GenerateButton from '../../common/GenerateButton';
import { getClip } from '../../../api/generation';
import { useImg2ImgParams } from '../../../hooks/generation/useImg2ImgParams';
import { RootState } from '../../../store/store';
import { message } from 'antd';

const Img2ImgLayout = () => {
  const dispatch = useDispatch();
  const { params, isLoading, gpuNum } = useSelector((state: RootState) => state.img2Img);
  const { prompt, negativePrompt, isNegativePrompt, updatePrompt, updateNegativePrompt } = useImg2ImgParams();

  const handleNegativePromptChange = () => {
    dispatch(setIsNegativePrompt(!isNegativePrompt));
  };

  let files;

  const handleGenerate = async () => {
    if (params.uploadImgParams.mode === 'manual') {
      files = params.uploadImgParams.imageList.map((base64Img, index) =>
        convertStringToFile(base64Img, `image_${index}.png`)
      );
      dispatch(setOutputImgsCnt(params.batchParams.batchCount * params.batchParams.batchSize));
      console.log('파일: ', files);
    } else {
      const fileDataArray = await window.electron.getFilesInFolder(params.uploadImgParams.inputPath);
      dispatch(setOutputImgsCnt(fileDataArray.length * params.batchParams.batchCount * params.batchParams.batchSize));

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
      strength: params.strengthParams.strength,
      image_list: files,
      input_path: params.uploadImgParams.inputPath,
      output_path: '' // 추후 settings 페이지 경로 넣을 예정
    };

    try {
      dispatch(setIsLoading(true));
      const newTaskId = await postImg2ImgGeneration('remote', data);

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

  // Clip아이콘 클릭
  const handleClipClick = async () => {
    // clipData가 빈 배열일 때만 getClip 실행
    if (params.uploadImgParams.clipData.length === 0) {
      try {
        if (params.uploadImgParams.imageList.length > 0) {
          const file = convertStringToFile(params.uploadImgParams.imageList[0], 'image.png');

          const generatedPrompts = await getClip([file]);
          dispatch(setClipData(generatedPrompts));
          console.log('clip 갱신: ', params.uploadImgParams.clipData);
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
            updatePrompt={updatePrompt}
            updateNegativePrompt={updateNegativePrompt}
            isNegativePrompt={isNegativePrompt}
            handleNegativePromptChange={handleNegativePromptChange}
            // 메뉴얼 모드일 때만 props로 전달(batch에서는 clip실행 안함)
            clipData={params.uploadImgParams.mode === 'manual' ? params.uploadImgParams.clipData : []}
            handleClipClick={params.uploadImgParams.mode === 'manual' ? handleClipClick : undefined}
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
