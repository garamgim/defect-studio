import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import {
  setModel,
  setScheduler,
  setWidth,
  setHeight,
  setSamplingSteps,
  setGuidanceScale,
  setSeed,
  setStrength,
  setIsRandomSeed,
  setBatchCount,
  setBatchSize,
  setImages,
  setInputPath,
  setOutputPath,
  setMode,
  setClipData,
  setPrompt,
  setNegativePrompt
} from '../../../store/slices/generation/img2ImgSlice';
import ModelParams from '../params/ModelParam';
import UploadImgParams from '../params/UploadImgParams';
import StrengthParam from '../params/StrengthParam';
import ImgDimensionParams from '../params/ImgDimensionParams';
import SamplingParams from '../params/SamplingParams';
import SeedParam from '../params/SeedParam';
import BatchParams from '../params/BatchParams';
import GuidanceScaleParam from '../params/GuidanceScaleParam';
import { FileAddOutlined, FileSearchOutlined, UndoOutlined } from '@ant-design/icons';
import { useState } from 'react';
import CreatePreset from '../presets/CreatePreset';
import LoadPreset from '../presets/LoadPreset';

const Img2ImgSidebar = () => {
  const dispatch = useDispatch();
  const {
    model,
    scheduler,
    width,
    height,
    samplingSteps,
    seed,
    isRandomSeed,
    guidanceScale,
    strength,
    batchCount,
    batchSize,
    inputPath,
    outputPath,
    images,
    prompt,
    negativePrompt
  } = useSelector((state: RootState) => state.img2Img);

  const level = useSelector((state: RootState) => state.level) as 'Basic' | 'Advanced';

  const handleRandomSeedChange = () => {
    dispatch(setIsRandomSeed(!isRandomSeed));
    dispatch(setSeed(!isRandomSeed ? -1 : seed));
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const img = new Image();
      img.onload = () => {
        dispatch(setClipData([]));
        dispatch(setImages([base64String]));
        console.log('images: ', images);
      };
      img.src = base64String;
    };
    reader.readAsDataURL(file); // 파일을 Base64로 변환
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

  return (
    <div className="w-full h-full mr-6">
      <div className="relative w-full h-full overflow-y-auto custom-scrollbar rounded-[15px] bg-white shadow-lg border border-gray-300 dark:bg-gray-600 dark:border-none">
        {/* reset parameters & preset */}
        {level === 'Advanced' && (
          <div className="absolute top-6 right-0 mx-6">
            <UndoOutlined className="mr-[16px] text-[18px] text-[#222] hover:text-blue-500 dark:text-gray-300 dark:hover:text-white cursor-pointer" />
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
        <ModelParams model={model} setModel={setModel} />

        <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

        {/* 이미지 업로드 */}
        <UploadImgParams
          handleImageUpload={handleImageUpload}
          imagePreview={images[0]}
          inputPath={inputPath}
          outputPath={outputPath}
          setInputPath={(value: string) => {
            dispatch(setInputPath(value));
          }}
          setOutputPath={(value: string) => {
            dispatch(setOutputPath(value));
          }}
          setMode={(value: 'manual' | 'batch') => {
            dispatch(setMode(value));
          }}
        />

        {level === 'Advanced' && (
          <>
            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 이미지 크기 */}
            <ImgDimensionParams
              width={width}
              height={height}
              setWidth={(value: number) => dispatch(setWidth(value))}
              setHeight={(value: number) => dispatch(setHeight(value))}
            />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 샘플링 세팅 */}
            <SamplingParams
              scheduler={scheduler}
              samplingSteps={samplingSteps}
              setSamplingSteps={(value: number) => dispatch(setSamplingSteps(value))}
              setScheduler={(value: string) => dispatch(setScheduler(value))}
            />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 초기 이미지 변화 제어 */}
            <GuidanceScaleParam
              guidanceScale={guidanceScale}
              setGuidanceScale={(value: number) => dispatch(setGuidanceScale(value))}
            />

            {/* 초기 이미지 변화 제어 */}
            <StrengthParam strength={strength} setStrength={(value: number) => dispatch(setStrength(value))} />

            {/* 이미지 재현/다양성 제어 */}
            <SeedParam
              seed={seed}
              isRandomSeed={isRandomSeed}
              setSeed={(value: number) => dispatch(setSeed(value))}
              handleRandomSeedChange={handleRandomSeedChange}
            />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 배치 세팅 */}
            <BatchParams
              batchCount={batchCount}
              batchSize={batchSize}
              setBatchCount={(value: number) => dispatch(setBatchCount(value))}
              setBatchSize={(value: number) => dispatch(setBatchSize(value))}
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
        samplingSteps={samplingSteps}
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
        setModel={(value: string) => dispatch(setModel(value))}
        setWidth={(value: number) => dispatch(setWidth(value))}
        setHeight={(value: number) => dispatch(setHeight(value))}
        setGuidanceScale={(value: number) => dispatch(setGuidanceScale(value))}
        setSamplingSteps={(value: number) => dispatch(setSamplingSteps(value))}
        setSeed={(value: number) => dispatch(setSeed(value))}
        setPrompt={(value: string) => dispatch(setPrompt(value))}
        setNegativePrompt={(value: string) => dispatch(setNegativePrompt(value))}
        setBatchCount={(value: number) => dispatch(setBatchCount(value))}
        setBatchSize={(value: number) => dispatch(setBatchSize(value))}
        setScheduler={(value: string) => dispatch(setScheduler(value))}
        setStrength={(value: number) => dispatch(setStrength(value))}
      />
    </div>
  );
};

export default Img2ImgSidebar;
