import { useState } from 'react';
import { FileAddOutlined, FileSearchOutlined, UndoOutlined } from '@ant-design/icons';
import ModelParam from '../params/ModelParam';
import UploadImgParams from '../params/UploadImgParams';
import StrengthParam from '../params/StrengthParam';
import ImgDimensionParams from '../params/ImgDimensionParams';
import SamplingParams from '../params/SamplingParams';
import SeedParam from '../params/SeedParam';
import BatchParams from '../params/BatchParams';
import GuidanceScaleParam from '../params/GuidanceScaleParam';
import CreatePreset from '../presets/CreatePreset';
import LoadPreset from '../presets/LoadPreset';
import { useImg2ImgParams } from '../../../hooks/generation/useImg2ImgParams';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { useDispatch } from 'react-redux';
import { resetState } from '../../../store/slices/generation/img2ImgSlice';

const Img2ImgSidebar = () => {
  const dispatch = useDispatch();

  // useSelector와 useCallback으로 처리하는 부분을 커스텀 훅으로 분리
  const {
    modelParams,
    samplingParams,
    strengthParams,
    guidanceParams,
    imgDimensionParams,
    seedParams,
    batchParams,
    prompt,
    negativePrompt,
    imageList,
    inputPath,
    outputPath,
    updateModelParams,
    updateSamplingParams,
    updateStrengthParams,
    updateSeedParams,
    updateGuidanceParams,
    updateImgDimensionParams,
    updateBatchParams,
    updateInputPath,
    updateOutputPath,
    updateMode,
    updatePrompt,
    updateNegativePrompt,
    updateClipData,
    updateImageList
  } = useImg2ImgParams();

  const level = useSelector((state: RootState) => state.level) as 'Basic' | 'Advanced';

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const img = new Image();
      img.onload = () => {
        updateClipData([]);
        updateImageList([base64String]);
      };
      img.src = base64String;
    };
    reader.readAsDataURL(file);
  };

  const [isCreatePresetOpen, setIsCreatePresetOpen] = useState(false);
  const [isLoadPresetOpen, setIsLoadPresetOpen] = useState(false);

  const showCreatePreset = () => {
    setIsCreatePresetOpen(true);
  };
  const closeCreatePreset = () => {
    setIsCreatePresetOpen(false);
  };
  const showLoadPreset = () => {
    setIsLoadPresetOpen(true);
  };
  const closeLoadPreset = () => {
    setIsLoadPresetOpen(false);
  };

  const handleReset = () => {
    dispatch(resetState());
  };

  return (
    <div className="w-full h-full mr-6">
      <div className="relative w-full h-full overflow-y-auto custom-scrollbar rounded-[15px] bg-white shadow-lg border border-gray-300 dark:bg-gray-600 dark:border-none">
        {/* reset parameters & preset */}
        {level === 'Advanced' && (
          <div className="absolute top-6 right-0 mx-6">
            <UndoOutlined
              onClick={handleReset}
              className="mr-[16px] text-[18px] text-[#222] hover:text-blue-500 dark:text-gray-300 dark:hover:text-white cursor-pointer"
            />
            <FileAddOutlined
              onClick={showCreatePreset}
              className="mr-[16px] text-[18px] text-[#222] hover:text-blue-500 dark:text-gray-300 dark:hover:text-white cursor-pointer"
            />
            <FileSearchOutlined
              onClick={showLoadPreset}
              className="text-[18px] text-[#222] hover:text-blue-500 dark:text-gray-300 dark:hover:text-white cursor-pointer"
            />
          </div>
        )}

        {/* 모델 */}
        <ModelParam modelParams={modelParams} updateModelParams={updateModelParams} />

        <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

        {/* 이미지 업로드 */}
        <UploadImgParams
          handleImageUpload={handleImageUpload}
          imagePreview={imageList[0]}
          inputPath={inputPath}
          outputPath={outputPath}
          updateInputPath={updateInputPath}
          updateOutputPath={updateOutputPath}
          updateMode={updateMode}
        />

        {level === 'Advanced' && (
          <>
            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 이미지 크기 */}
            <ImgDimensionParams
              imgDimensionParams={imgDimensionParams}
              updateImgDimensionParams={updateImgDimensionParams}
            />
            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 샘플링 세팅 */}
            <SamplingParams samplingParams={samplingParams} updateSamplingParams={updateSamplingParams} />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 초기 이미지 변화 제어 */}
            <GuidanceScaleParam guidanceParams={guidanceParams} updateGuidanceParams={updateGuidanceParams} />

            {/* 초기 이미지 변화 제어 */}
            <StrengthParam strengthParams={strengthParams} updateStrengthParams={updateStrengthParams} />

            {/* 이미지 재현 & 다양성 세팅 */}
            <SeedParam seedParams={seedParams} updateSeedParams={updateSeedParams} />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 배치 세팅 */}
            <BatchParams batchParams={batchParams} updateBatchParams={updateBatchParams} />
          </>
        )}
      </div>

      {/* 프리셋 생성 */}
      <CreatePreset
        modelParams={modelParams}
        batchParams={batchParams}
        imgDimensionParams={imgDimensionParams}
        guidanceParams={guidanceParams}
        samplingParams={samplingParams}
        seedParams={seedParams}
        strengthParams={strengthParams}
        prompt={prompt}
        negativePrompt={negativePrompt}
        type="image_to_image"
        isModalOpen={isCreatePresetOpen}
        closeModal={closeCreatePreset}
      />

      {/* 프리셋 다운로드 */}
      <LoadPreset
        isModalOpen={isLoadPresetOpen}
        closeModal={closeLoadPreset}
        type="image_to_image"
        updateModelParams={updateModelParams}
        updateSamplingParams={updateSamplingParams}
        updateSeedParams={updateSeedParams}
        updateGuidanceParams={updateGuidanceParams}
        updateImgDimensionParams={updateImgDimensionParams}
        updateBatchParams={updateBatchParams}
        updatePrompt={updatePrompt}
        updateNegativePrompt={updateNegativePrompt}
        updateStrengthParams={updateStrengthParams}
      />
    </div>
  );
};

export default Img2ImgSidebar;
