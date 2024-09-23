import { useState } from 'react';
import { Button } from 'antd';
import { FormatPainterOutlined, FileAddOutlined, FileSearchOutlined, UndoOutlined } from '@ant-design/icons';
import Model from '../params/InpaintingModelParam';
import MaskingModal from '../masking/MaskingModal';
import SamplingParams from '../params/SamplingParams';
import ImgDimensionParams from '../params/ImgDimensionParams';
import SeedParam from '../params/SeedParam';
import BatchParams from '../params/BatchParams';
import StrengthParam from '../params/StrengthParam';
import GuidanceScaleParms from '../params/GuidanceScaleParam';
import UploadImgWithMaskingParams from '../params/UploadImgWithMaskingParams';
import { useInpaintingParams } from '../../../hooks/generation/useInpaintingParams';
import CreatePreset from '../presets/CreatePreset';
import LoadPreset from '../presets/LoadPreset';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { setCombinedImg, resetState } from '../../../store/slices/generation/inpaintingSlice';
import { useDispatch } from 'react-redux';

const InpaintingSidebar = () => {
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
    initInputPath,
    maskInputPath,
    outputPath,
    mode,
    initImageList,
    combinedImg,
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
    handleSetInitImageList,
    handleSetMaskImageList,
    handleSetClipData,
    handleSetInitInputPath,
    handleSetMaskInputPath,
    handleSetOutputPath,
    handleSetMode,
    handleSetPrompt,
    handleSetNegativePrompt,
    handleSetCombinedImg
  } = useInpaintingParams();

  const level = useSelector((state: RootState) => state.level) as 'Basic' | 'Advanced';

  const [showModal, setShowModal] = useState(false);

  const handleRandomSeedChange = () => {
    handleSetIsRandomSeed(!isRandomSeed);
    handleSetSeed(!isRandomSeed ? -1 : seed);
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const img = new Image();
      img.onload = async () => {
        handleSetClipData([]);
        handleSetInitImageList([base64String]);

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
        <Model model={model} setModel={handleSetModel} />

        <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

        {/* 이미지 업로드 */}
        <UploadImgWithMaskingParams
          handleImageUpload={handleImageUpload}
          imagePreview={initImageList[0]}
          initInputPath={initInputPath}
          maskInputPath={maskInputPath}
          outputPath={outputPath}
          setInitInputPath={handleSetInitInputPath}
          setMaskInputPath={handleSetMaskInputPath}
          setOutputPath={handleSetOutputPath}
          setMode={handleSetMode}
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

            {/* 샘플링 설정 */}
            <SamplingParams
              scheduler={scheduler}
              numInferenceSteps={numInferenceSteps}
              setNumInferenceSteps={handleSetNumInferenceSteps}
              setScheduler={handleSetScheduler}
            />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 이미지 크기 설정 */}
            <ImgDimensionParams width={width} height={height} setWidth={handleSetWidth} setHeight={handleSetHeight} />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* guidance scale 설정 */}
            <GuidanceScaleParms guidanceScale={guidanceScale} setGuidanceScale={handleSetGuidanceScale} />

            {/* strength 설정 */}
            <StrengthParam strength={strength} setStrength={handleSetStrength} />

            {/* seed 설정 */}
            <SeedParam
              seed={seed}
              setSeed={handleSetSeed}
              isRandomSeed={isRandomSeed}
              handleRandomSeedChange={handleRandomSeedChange}
            />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 배치 설정 */}
            <BatchParams
              batchCount={batchCount}
              batchSize={batchSize}
              setBatchCount={handleSetBatchCount}
              setBatchSize={handleSetBatchSize}
            />
          </>
        )}
      </div>

      {/* Masking 모달 창 */}
      {showModal && initImageList[0] && (
        <MaskingModal
          imageSrc={initImageList[0]}
          onClose={handleCloseModal}
          setInitImageList={handleSetInitImageList}
          setMaskImageList={handleSetMaskImageList}
          setCombinedImg={handleSetCombinedImg}
        />
      )}

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
        type="inpainting"
        isModalOpen={isCreatePresetOpen}
        closeModal={closeCreatePreset}
        strength={strength}
      />

      {/* 프리셋 다운로드 */}
      <LoadPreset
        isModalOpen={isLoadPresetOpen}
        closeModal={closeLoadPreset}
        type="inpainting"
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

export default InpaintingSidebar;
