import { useState, useCallback } from 'react';
import CreatePreset from '../presets/CreatePreset';
import LoadPreset from '../presets/LoadPreset';
import ModelParam from '../params/ModelParam';
import ImgDimensionParams from '../params/ImgDimensionParams';
import GuidanceScaleParam from '../params/GuidanceScaleParam';
import SeedParam from '../params/SeedParam';
import SamplingParams from '../params/SamplingParams';
import BatchParams from '../params/BatchParams';
import { FileAddOutlined, FileSearchOutlined, UndoOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { resetParams, setGpuNum } from '../../../store/slices/generation/txt2ImgSlice';
import { useTxt2ImgParams } from '../../../hooks/generation/params/useTxt2ImgParams';
import { MdMemory } from 'react-icons/md';
import { Modal, InputNumber, Tooltip } from 'antd';

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
    updateBatchParams,
    updatePrompt,
    updateNegativePrompt
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
    dispatch(resetParams());
  };

  // GPU 선택
  const [gpuNumer, setGpuNumer] = useState(0);
  const [isGpuModalVisible, setIsGpuModalVisible] = useState(false);

  const showGpuModal = () => {
    setIsGpuModalVisible(true);
  };

  const handleGpuInputChange = (gpuNumer: number | null) => {
    if (gpuNumer) {
      setGpuNumer(gpuNumer);
    }
  };

  const handleGpuModalOk = () => {
    if (gpuNumer !== null) {
      dispatch(setGpuNum(gpuNumer));
    }
    setIsGpuModalVisible(false);
  };

  const handleGpuModalCancel = () => {
    setIsGpuModalVisible(false);
  };

  return (
    <div className="w-full h-full mr-6">
      <div className="relative w-full h-full overflow-y-auto custom-scrollbar rounded-[15px] bg-white shadow-lg border border-gray-300 dark:bg-gray-600 dark:border-none">
        {level === 'Advanced' && (
          <div className="absolute top-6 right-0 mr-6">
            <div className="flex">
              <Tooltip title="Reset Parameters">
                <UndoOutlined
                  onClick={handleReset}
                  className="mr-[16px] text-[18px] text-[#222] hover:text-blue-500 dark:text-gray-300 dark:hover:text-white cursor-pointer transition-transform transform hover:scale-110"
                />
              </Tooltip>

              <Tooltip title="Create Preset">
                <FileAddOutlined
                  onClick={showCreatePreset}
                  className="mr-[16px] text-[18px] text-[#222] hover:text-blue-500 dark:text-gray-300 dark:hover:text-white cursor-pointer transition-transform transform hover:scale-110"
                />
              </Tooltip>

              <Tooltip title="Load Preset">
                <FileSearchOutlined
                  onClick={showLoadPreset}
                  className="mr-[16px] text-[18px] text-[#222] hover:text-blue-500 dark:text-gray-300 dark:hover:text-white cursor-pointer transition-transform transform hover:scale-110"
                />
              </Tooltip>

              <Tooltip title="Enter GPU Number">
                <MdMemory
                  className="text-[22px] text-[#222] hover:text-blue-500 dark:text-gray-300 dark:hover:text-white cursor-pointer transition-transform transform hover:scale-110"
                  onClick={showGpuModal}
                />
              </Tooltip>
            </div>
          </div>
        )}

        {/* 모델 */}
        <ModelParam modelParams={modelParams} updateModelParams={updateModelParams} />

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

            {/* 이미지 재현 & 다양성 세팅 */}
            <SeedParam seedParams={seedParams} updateSeedParams={updateSeedParams} />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 배치 세팅 */}
            <BatchParams batchParams={batchParams} updateBatchParams={updateBatchParams} />
          </>
        )}
      </div>

      {/* gpu 선택 모달 */}
      <Modal open={isGpuModalVisible} closable={false} onOk={handleGpuModalOk} onCancel={handleGpuModalCancel}>
        <div className="text-[20px] mb-[20px] font-semibold dark:text-gray-300">Input the GPU number you want</div>
        <InputNumber min={0} onChange={handleGpuInputChange} />
      </Modal>

      {/* 프리셋 생성 */}
      <CreatePreset
        modelParams={modelParams}
        batchParams={batchParams}
        imgDimensionParams={imgDimensionParams}
        guidanceParams={guidanceParams}
        samplingParams={samplingParams}
        seedParams={seedParams}
        prompt={prompt}
        negativePrompt={negativePrompt}
        type="text_to_image"
        isModalOpen={isCreatePresetOpen}
        closeModal={closeCreatePreset}
      />

      {/* 프리셋 다운로드 */}
      <LoadPreset
        isModalOpen={isLoadPresetOpen}
        closeModal={closeLoadPreset}
        type="text_to_image"
        updateModelParams={updateModelParams}
        updateSamplingParams={updateSamplingParams}
        updateSeedParams={updateSeedParams}
        updateGuidanceParams={updateGuidanceParams}
        updateImgDimensionParams={updateImgDimensionParams}
        updateBatchParams={updateBatchParams}
        updatePrompt={updatePrompt}
        updateNegativePrompt={updateNegativePrompt}
      />
    </div>
  );
};

export default Sidebar;
