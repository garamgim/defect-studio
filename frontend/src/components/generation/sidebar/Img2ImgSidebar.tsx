import { useState } from 'react';
import { FileAddOutlined, FileSearchOutlined, UndoOutlined } from '@ant-design/icons';
import ModelParams from '../params/ModelParam';
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
  const {
    model,
    scheduler,
    width,
    height,
    numInferenceSteps,
    seed,
    isRandomSeed,
    guidanceScale,
    strength,
    batchCount,
    batchSize,
    inputPath,
    outputPath,
    imageList,
    prompt,
    negativePrompt,
    handleSetModel,
    handleSetScheduler,
    handleSetWidth,
    handleSetHeight,
    handleSetNumInferenceSteps,
    handleSetGuidanceScale,
    handleSetSeed,
    handleSetStrength,
    handleSetIsRandomSeed,
    handleSetBatchCount,
    handleSetBatchSize,
    handleSetImageList,
    handleSetInputPath,
    handleSetOutputPath,
    handleSetMode,
    handleSetClipData,
    handleSetPrompt,
    handleSetNegativePrompt
  } = useImg2ImgParams();

  const level = useSelector((state: RootState) => state.level) as 'Basic' | 'Advanced';

  const handleRandomSeedChange = () => {
    handleSetIsRandomSeed(!isRandomSeed);
    handleSetSeed(!isRandomSeed ? -1 : seed);
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const img = new Image();
      img.onload = () => {
        handleSetClipData([]);
        handleSetImageList([base64String]);
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

  const dispatch = useDispatch();
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

        {/* 모델 선택 */}
        <ModelParams model={model} setModel={handleSetModel} />

        <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

        {/* 이미지 업로드 */}
        <UploadImgParams
          handleImageUpload={handleImageUpload}
          imagePreview={imageList[0]}
          inputPath={inputPath}
          outputPath={outputPath}
          setInputPath={handleSetInputPath}
          setOutputPath={handleSetOutputPath}
          setMode={handleSetMode}
        />

        {level === 'Advanced' && (
          <>
            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 이미지 크기 */}
            <ImgDimensionParams width={width} height={height} setWidth={handleSetWidth} setHeight={handleSetHeight} />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 샘플링 세팅 */}
            <SamplingParams
              scheduler={scheduler}
              numInferenceSteps={numInferenceSteps}
              setNumInferenceSteps={handleSetNumInferenceSteps}
              setScheduler={handleSetScheduler}
            />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 초기 이미지 변화 제어 */}
            <GuidanceScaleParam guidanceScale={guidanceScale} setGuidanceScale={handleSetGuidanceScale} />

            {/* 초기 이미지 변화 제어 */}
            <StrengthParam strength={strength} setStrength={handleSetStrength} />

            {/* 이미지 재현/다양성 제어 */}
            <SeedParam
              seed={seed}
              isRandomSeed={isRandomSeed}
              setSeed={handleSetSeed}
              handleRandomSeedChange={handleRandomSeedChange}
            />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 배치 세팅 */}
            <BatchParams
              batchCount={batchCount}
              batchSize={batchSize}
              setBatchCount={handleSetBatchCount}
              setBatchSize={handleSetBatchSize}
            />
          </>
        )}
      </div>

      {/* 프리셋 생성 */}
      <CreatePreset
        model={model}
        width={width}
        height={height}
        guidanceScale={guidanceScale}
        numInferenceSteps={numInferenceSteps}
        seed={seed}
        prompt={prompt}
        negativePrompt={negativePrompt}
        batchCount={batchCount}
        batchSize={batchSize}
        scheduler={scheduler}
        type="image_to_image"
        isModalOpen={isCreatePresetOpen}
        closeModal={closeCreatePreset}
      />

      {/* 프리셋 다운로드 */}
      <LoadPreset
        isModalOpen={isLoadPresetOpen}
        closeModal={closeLoadPreset}
        type="image_to_image"
        setModel={handleSetModel}
        setWidth={handleSetWidth}
        setHeight={handleSetHeight}
        setGuidanceScale={handleSetGuidanceScale}
        setNumInferenceSteps={handleSetNumInferenceSteps}
        setSeed={handleSetSeed}
        setPrompt={handleSetPrompt}
        setNegativePrompt={handleSetNegativePrompt}
        setBatchCount={handleSetBatchCount}
        setBatchSize={handleSetBatchSize}
        setScheduler={handleSetScheduler}
        setStrength={handleSetStrength}
      />
    </div>
  );
};

export default Img2ImgSidebar;
