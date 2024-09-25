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
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { resetState } from '../../../store/slices/generation/txt2ImgSlice';
import { useTxt2ImgParams } from '../../../hooks/generation/useTxt2ImgParams';

const Sidebar = () => {
  const dispatch = useDispatch();

  // useSelector와 useCallback으로 처리하는 부분을 커스텀 훅으로 분리
  const {
    modelParams,
    samplingParams,
    guidanceParams,
    imgDimensionParams,
    seedParams,
    batchParams,
    prompt,
    negativePrompt,
    updateModelParams,
    updateSamplingParams,
    updateSeedParams,
    updateGuidanceParams,
    updateImgDimensionParams,
    updateBatchParams
  } = useTxt2ImgParams();

  // 사용자 레벨에 따라서 보이는 컴포넌트 구분
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
        <ModelParam modelParams={modelParams} updateModelParams={updateModelParams} />

        {level === 'Advanced' && (
          <>
            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 이미지 크기 파라미터 */}
            <ImgDimensionParams
              imgDimensionParams={imgDimensionParams}
              updateImgDimensionParams={updateImgDimensionParams}
            />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 샘플링 세팅 파라미터 */}
            <SamplingParams samplingParams={samplingParams} updateSamplingParams={updateSamplingParams} />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 초기 이미지에서의 변화 세팅 */}
            <GuidanceScaleParams guidanceParams={guidanceParams} updateGuidanceParams={updateGuidanceParams} />

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
