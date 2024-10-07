import { useState } from 'react';
import { Button, Modal, InputNumber, Tooltip } from 'antd';
import { FormatPainterOutlined, FileAddOutlined, FileSearchOutlined, UndoOutlined } from '@ant-design/icons';
import ModelParam from '../params/InpaintingModelParam';
import MaskingModal from '../masking/MaskingModal';
import SamplingParams from '../params/SamplingParams';
import ImgDimensionParams from '../params/ImgDimensionParams';
import SeedParam from '../params/SeedParam';
import BatchParams from '../params/BatchParams';
import StrengthParam from '../params/StrengthParam';
import GuidanceScaleParam from '../params/GuidanceScaleParam';
import UploadImgWithMaskingParams from '../params/UploadImgWithMaskingParams';
import { useInpaintingParams } from '../../../hooks/generation/params/useInpaintingParams';
import CreatePreset from '../presets/CreatePreset';
import LoadPreset from '../presets/LoadPreset';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { MdMemory } from 'react-icons/md';
import { setCombinedImg, resetParams, setGpuNum } from '../../../store/slices/generation/inpaintingSlice';
import { useDispatch } from 'react-redux';

const InpaintingSidebar = () => {
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
    mode,
    combinedImg,
    initImageList,
    maskInputPath,
    initInputPath,
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
    updateInitImageList,
    updateMaskImageList,
    updateInitInputPath,
    updateOutputPath,
    updateMode,
    updatePrompt,
    updateNegativePrompt,
    updateClipData,
    updateMaskInputPath,
    updateCombinedImg
  } = useInpaintingParams();

  const level = useSelector((state: RootState) => state.level) as 'Basic' | 'Advanced';

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const img = new Image();
      img.onload = async () => {
        // 이미지 크기 제한 (2024x2024 이하)
        if (img.width > 2024 || img.height > 2024) {
          alert('The image is too large. Please upload an image with a size less than or equal to 2024x2024.');
          return;
        }
        updateClipData([]);
        updateInitImageList([base64String]);
        setCombinedImg(null);
      };

      img.onerror = () => {
        alert('Failed to load the image. Please try again.');
      };
      img.src = base64String;
    };
    reader.onerror = () => {
      alert('Failed to read the file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const [isCreatePresetOpen, setIsCreatePresetOpen] = useState(false);
  const [isLoadPresetOpen, setIsLoadPresetOpen] = useState(false);
  const [isMaskingOpen, setIsMaskingOpen] = useState(false);

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

  const closeMasking = () => {
    setIsMaskingOpen(false);
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

        <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

        {/* 이미지 업로드 */}
        <UploadImgWithMaskingParams
          handleImageUpload={handleImageUpload}
          imagePreview={initImageList[0]}
          initInputPath={initInputPath}
          maskInputPath={maskInputPath}
          outputPath={outputPath}
          updateInitInputPath={updateInitInputPath}
          updateMaskInputPath={updateMaskInputPath}
          updateOutputPath={updateOutputPath}
          updateMode={updateMode}
          isZipDownload={isZipDownload}
          updateIsZipDownload={updateIsZipDownload}
        />

        {initImageList[0] && (
          <div className="px-6 pb-10">
            {/* Start Masking 버튼 */}
            {mode === 'manual' && (
              <Button
                type="primary"
                icon={<FormatPainterOutlined />}
                onClick={() => setIsMaskingOpen(true)} // 버튼 클릭 시 모달 열기
                className="w-full mt-2"
              >
                Start Masking
              </Button>
            )}

            {/* 인페인팅 결과 */}
            {mode === 'manual' && combinedImg && (
              <div className="w-full border border-dashed border-gray-300 rounded-lg mt-4 flex flex-col items-center">
                <img src={combinedImg} alt="Inpainting Result" className="w-full h-full object-cover rounded-lg" />
              </div>
            )}
          </div>
        )}

        {level === 'Advanced' && (
          <>
            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 이미지 크기 */}
            <ImgDimensionParams
              imgDimensionParams={imgDimensionParams}
              updateImgDimensionParams={updateImgDimensionParams}
            />

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

      {/* Masking 모달 창 */}
      <MaskingModal
        isModalOpen={isMaskingOpen}
        imageSrc={initImageList[0]}
        closeModal={closeMasking}
        updateInitImageList={updateInitImageList}
        updateMaskImageList={updateMaskImageList}
        updateCombinedImg={updateCombinedImg}
      />

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
        type="inpainting"
        isModalOpen={isCreatePresetOpen}
        closeModal={closeCreatePreset}
      />

      {/* 프리셋 다운로드 */}
      <LoadPreset
        isModalOpen={isLoadPresetOpen}
        closeModal={closeLoadPreset}
        type="inpainting"
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

export default InpaintingSidebar;
