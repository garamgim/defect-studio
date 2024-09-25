import { useState, useCallback } from 'react';
import CreatePreset from '../presets/CreatePreset';
import LoadPreset from '../presets/LoadPreset';
import ModelParam from '../params/ModelParam';
import ImgDimensionParams from '../params/ImgDimensionParams';
import GuidanceScaleParams from '../params/GuidanceScaleParam';
import SeedParam from '../params/SeedParam';
import SamplingParams from '../params/SamplingParams';
import BatchParams from '../params/BatchParams';
import { FileAddOutlined, FileSearchOutlined, UndoOutlined } from '@ant-design/icons';
import { useTxt2ImgParams } from '../../../hooks/generation/useTxt2ImgParams';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { resetState } from '../../../store/slices/generation/txt2ImgSlice';
import { useDispatch } from 'react-redux';

const Sidebar = () => {
  
  const level = useSelector((state: RootState) => state.level) as 'Basic' | 'Advanced';

  const [isCreatePresetOpen, setIsCreatePresetOpen] = useState(false);
  const [isLoadPresetOpen, setIsLoadPresetOpen] = useState(false);

  const showCreatePreset = useCallback(() => {
    setIsCreatePresetOpen(true);
  }, []);

  const closeCreatePreset = useCallback(() => {
    setIsCreatePresetOpen(false);
  }, []);

  const showLoadPreset = useCallback(() => {
    setIsLoadPresetOpen(true);
  }, []);

  const closeLoadPreset = useCallback(() => {
    setIsLoadPresetOpen(false);
  }, []);

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

        {/* 모델 파라미터 */}
        <ModelParam model={model} setModel={handleSetModel} />

        {level === 'Advanced' && (
          <>
            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 이미지 크기 파라미터 */}
            <ImgDimensionParams width={width} height={height} setWidth={handleSetWidth} setHeight={handleSetHeight} />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 샘플링 세팅 파라미터 */}
            <SamplingParams
              scheduler={scheduler}
              numInferenceSteps={numInferenceSteps}
              setNumInferenceSteps={handleSetNumInferenceSteps}
              setScheduler={handleSetScheduler}
            />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 초기 이미지에서의 변화 세팅 */}
            <GuidanceScaleParams guidanceScale={guidanceScale} setGuidanceScale={handleSetGuidanceScale} />

            {/* 이미지 재현 & 다양성 세팅 */}
            <SeedParam
              seed={seed}
              setSeed={handleSetSeed}
              isRandomSeed={isRandomSeed}
              handleRandomSeedChange={handleSetIsRandomSeed}
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
        type="text_to_image"
        isModalOpen={isCreatePresetOpen}
        closeModal={closeCreatePreset}
      />

      {/* 프리셋 다운로드 */}
      <LoadPreset
        isModalOpen={isLoadPresetOpen}
        closeModal={closeLoadPreset}
        type="text_to_image"
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
      />
    </div>
  );
};

export default Sidebar;
