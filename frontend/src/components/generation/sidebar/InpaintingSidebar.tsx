import { useState } from 'react';
import { Button } from 'antd';
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
import { useInpaintingParams } from '../../../hooks/generation/useInpaintingParams';
import CreatePreset from '../presets/CreatePreset';
import LoadPreset from '../presets/LoadPreset';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { setCombinedImg, resetState } from '../../../store/slices/generation/inpaintingSlice';
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

  const [showModal, setShowModal] = useState(false);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const img = new Image();
      img.onload = async () => {
        updateClipData([]);
        updateInitImageList([base64String]);

        setCombinedImg(null);
      };
      img.src = base64String;
    };
    reader.readAsDataURL(file);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
        />

        {initImageList[0] && (
          <div className="px-6 pb-10">
            {/* Start Masking 버튼 */}
            {mode === 'manual' && (
              <Button
                type="primary"
                icon={<FormatPainterOutlined />}
                onClick={() => setShowModal(true)} // 버튼 클릭 시 모달 열기
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
      {showModal && initImageList[0] && (
        <MaskingModal
          imageSrc={initImageList[0]}
          onClose={handleCloseModal}
          updateInitImageList={updateInitImageList}
          updateMaskImageList={updateMaskImageList}
          updateCombinedImg={updateCombinedImg}
        />
      )}

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
