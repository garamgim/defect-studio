import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
<<<<<<< HEAD
import CreatePreset from '../presets/CreatePreset';
import LoadPreset from '../presets/LoadPreset';
import { useState } from 'react';

=======
>>>>>>> feature/fe/42-token-page-ui
import {
  setWidth,
  setHeight,
  setGuidanceScale,
  setSamplingSteps,
  setSeed,
  setIsRandomSeed,
  setModel,
  setScheduler,
  setBatchCount,
<<<<<<< HEAD
  setBatchSize,
  setPrompt,
  setNegativePrompt
=======
  setBatchSize
>>>>>>> feature/fe/42-token-page-ui
} from '../../../store/slices/generation/txt2ImgSlice';
import ModelParam from '../params/ModelParam';
import ImgDimensionParams from '../params/ImgDimensionParams';
import GuidanceScaleParams from '../params/GuidanceScaleParam';
import SeedParam from '../params/SeedParam';
import SamplingParams from '../params/SamplingParams';
import BatchParams from '../params/BatchParams';
<<<<<<< HEAD
import { FileAddOutlined, FileSearchOutlined, UndoOutlined } from '@ant-design/icons';

const Sidebar = () => {
  const dispatch = useDispatch();
  const {
    width,
    height,
    guidanceScale,
    samplingSteps,
    seed,
    isRandomSeed,
    model,
    scheduler,
    batchCount,
    batchSize,
    prompt,
    negativePrompt
  } = useSelector((state: RootState) => state.txt2Img);
=======

const Sidebar = () => {
  const dispatch = useDispatch();
  const { width, height, guidanceScale, samplingSteps, seed, isRandomSeed, model, scheduler, batchCount, batchSize } =
    useSelector((state: RootState) => state.txt2Img); // txt2Img 상태 가져오기
>>>>>>> feature/fe/42-token-page-ui

  const level = useSelector((state: RootState) => state.level) as 'Basic' | 'Advanced';

  const handleRandomSeedChange = () => {
    dispatch(setIsRandomSeed(!isRandomSeed));
    dispatch(setSeed(!isRandomSeed ? -1 : seed));
<<<<<<< HEAD
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

=======
  };

  return (
    <div className="w-full h-full fixed-height mr-6">
      <div className="w-full h-full overflow-y-auto custom-scrollbar rounded-[15px] bg-white shadow-lg border border-gray-300 dark:bg-gray-600 dark:border-none">
>>>>>>> feature/fe/42-token-page-ui
        {/* 모델 */}
        <ModelParam model={model} setModel={(value: string) => dispatch(setModel(value))} />

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

            {/* 초기 이미지에서의 변화 세팅 */}
            <GuidanceScaleParams
              guidanceScale={guidanceScale}
              setGuidanceScale={(value: number) => dispatch(setGuidanceScale(value))}
            />

<<<<<<< HEAD
=======
            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

>>>>>>> feature/fe/42-token-page-ui
            {/* 이미지 재현 & 다양성 세팅 */}
            <SeedParam
              seed={seed}
              setSeed={(value: number) => dispatch(setSeed(value))}
              isRandomSeed={isRandomSeed}
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
        type="text_to_image"
        isModalOpen={isCreatePresetOpen}
        closeModal={closeCreatePreset}
      />

      {/* 프리셋 다운로드 */}
      <LoadPreset
        isModalOpen={isLoadPresetOpen}
        closeModal={closeLoadPreset}
        type="text_to_image"
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
      />
    </div>
  );
};

export default Sidebar;
