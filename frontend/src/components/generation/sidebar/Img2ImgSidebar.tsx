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
import { useImg2ImgParams } from '../../../hooks/generation/params/useImg2ImgParams';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { useDispatch } from 'react-redux';
import { MdMemory } from 'react-icons/md';
import { resetParams, setGpuNum } from '../../../store/slices/generation/img2ImgSlice';
import { Modal, InputNumber, Tooltip, message } from 'antd';

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
    isZipDownload,
    updateIsZipDownload,
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
        // 이미지 크기 제한 (2024x2024 이하)
        if (img.width > 2024 || img.height > 2024) {
          window.electron.showMessageBox({
            type: 'warning',
            title: 'Image Size Warning',
            message: 'The image is too large. Please upload an image with a size less than or equal to 2024x2024.'
          });
          return;
        }
        updateClipData([]);
        updateImageList([base64String]);
      };

      img.onerror = () => {
        window.electron.showMessageBox({
          type: 'warning',
          title: 'Image Size Warning',
          message: 'The image is too large. Please upload an image with a size less than or equal to 2024x2024.'
        });
      };
      img.src = base64String;
    };
    reader.onerror = () => {
      message.error('Failed to read the file. Please try again.');
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
          <div className="absolute top-[24px] right-0 mr-[45px]">
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
            </div>
          </div>
        )}

        {/* GPU 버튼은 항상 표시 */}
        <div className="absolute top-[22px] right-0 mr-6">
          <Tooltip title="Enter GPU Number">
            <MdMemory
              className="text-[22px] text-[#222] hover:text-blue-500 dark:text-gray-300 dark:hover:text-white cursor-pointer transition-transform transform hover:scale-110"
              onClick={showGpuModal}
            />
          </Tooltip>
        </div>

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
          isZipDownload={isZipDownload}
          updateIsZipDownload={updateIsZipDownload}
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
