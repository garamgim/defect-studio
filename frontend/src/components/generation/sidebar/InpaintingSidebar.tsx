import { useState } from 'react';
import { Button } from 'antd';
import { FormatPainterOutlined } from '@ant-design/icons';
import { RootState } from '../../../store/store';
import Model from '../params/ModelParam';
<<<<<<< HEAD
import MaskingModal from '../masking/MaskingModal';
=======
import InpaintingModal from '../masking/MaskingModal';
>>>>>>> feature/fe/42-token-page-ui
import SamplingParams from '../params/SamplingParams';
import ImgDimensionParams from '../params/ImgDimensionParams';
import SeedParam from '../params/SeedParam';
import BatchParams from '../params/BatchParams';
import StrengthParam from '../params/StrengthParam';
import GuidanceScaleParms from '../params/GuidanceScaleParam';
import UploadImgWithMaskingParams from '../params/UploadImgWithMaskingParams';
import { useSelector, useDispatch } from 'react-redux';
<<<<<<< HEAD
import { saveImages } from '../../../store/slices/generation/maskingSlice';
=======
>>>>>>> feature/fe/42-token-page-ui
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
<<<<<<< HEAD
  setBatchSize,
  setInitImageList,
  setMaskImageList,
  setClipData,
  setInitInputPath,
  setMaskInputPath,
  setOutputPath,
  setMode,
  setPrompt,
  setNegativePrompt
} from '../../../store/slices/generation/inpaintingSlice';
import { FileAddOutlined, FileSearchOutlined, UndoOutlined } from '@ant-design/icons';
import CreatePreset from '../presets/CreatePreset';
import LoadPreset from '../presets/LoadPreset';

const InpaintingSidebar = () => {
  const { combinedImg } = useSelector((state: RootState) => state.masking);
=======
  setBatchSize
} from '../../../store/slices/generation/img2ImgSlice';

const InpaintingSidebar: React.FC = () => {
  const { BgImage, canvasImage, combinedImage } = useSelector((state: RootState) => state.masking);
>>>>>>> feature/fe/42-token-page-ui

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
<<<<<<< HEAD
    batchSize,
    initInputPath,
    maskInputPath,
    outputPath,
    mode,
    initImageList,
    prompt,
    negativePrompt
  } = useSelector((state: RootState) => state.inpainting);
=======
    batchSize
  } = useSelector((state: RootState) => state.img2Img);
>>>>>>> feature/fe/42-token-page-ui

  const level = useSelector((state: RootState) => state.level) as 'Basic' | 'Advanced';

  const [showModal, setShowModal] = useState(false);
<<<<<<< HEAD
=======
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('manual');
>>>>>>> feature/fe/42-token-page-ui

  const handleRandomSeedChange = () => {
    setIsRandomSeed(!isRandomSeed);
    setSeed(!isRandomSeed ? -1 : seed);
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const img = new Image();
<<<<<<< HEAD
      img.onload = async () => {
        dispatch(setClipData([]));
        dispatch(setInitImageList([base64String]));

        dispatch(
          saveImages({
            backgroundImg: null,
            canvasImg: null,
            combinedImg: null
          })
        );
=======
      img.onload = () => {
        setImageSrc(reader.result as string);
>>>>>>> feature/fe/42-token-page-ui
      };
      img.src = base64String;
    };
    reader.readAsDataURL(file);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

<<<<<<< HEAD
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
  const handleDownloadBgImage = () => {
    handleDownloadImage(BgImage, 'stage_image.png'); // BgImage 다운로드
  };

  const handleDownloadCanvasImage = () => {
    handleDownloadImage(canvasImage, 'canvas_image.png'); // canvasImage 다운로드
  };

  const handleCloseModal = () => {
    setShowModal(false); // 모달 닫기
  };

  return (
    <div className="w-full h-full fixed-height mr-6">
      <div className="w-full h-full overflow-y-auto custom-scrollbar rounded-[15px] bg-white shadow-lg border border-gray-300 dark:bg-gray-600 dark:border-none">
>>>>>>> feature/fe/42-token-page-ui
        {/* 모델 선택 */}
        <Model model={model} setModel={setModel} />

        <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

        {/* 이미지 업로드 */}
        <UploadImgWithMaskingParams
          handleImageUpload={handleImageUpload}
<<<<<<< HEAD
          imagePreview={initImageList[0]}
          initInputPath={initInputPath}
          maskInputPath={maskInputPath}
          outputPath={outputPath}
          setInitInputPath={(value: string) => {
            dispatch(setInitInputPath(value));
          }}
          setMaskInputPath={(value: string) => {
            dispatch(setMaskInputPath(value));
          }}
          setOutputPath={(value: string) => {
            dispatch(setOutputPath(value));
          }}
          setMode={(value: 'manual' | 'batch') => {
            dispatch(setMode(value));
          }}
=======
          imagePreview={imageSrc}
          setActiveTab={setActiveTab}
>>>>>>> feature/fe/42-token-page-ui
        />

        {initImageList[0] && (
          <div className="px-6 pb-10">
            {/* Start Masking 버튼 */}
<<<<<<< HEAD
            {mode === 'manual' && (
=======
            {activeTab === 'manual' && (
>>>>>>> feature/fe/42-token-page-ui
              <Button
                type="primary"
                icon={<FormatPainterOutlined />}
                onClick={() => setShowModal(true)} // 버튼 클릭 시 모달 열기
                className="w-full mt-2"
              >
                Start Masking
              </Button>
            )}

<<<<<<< HEAD
            {/* 인페인팅 결과 */}
            {mode === 'manual' && combinedImg && (
              <div className="w-full border border-dashed border-gray-300 rounded-lg mt-4 flex flex-col items-center">
                <img src={combinedImg} alt="Inpainting Result" className="w-full h-full object-cover rounded-lg" />
=======
            {/* 인페인팅 결과 및 다운로드 */}
            {combinedImage && (
              <div className="w-full border border-dashed border-gray-300 rounded-lg mt-4 flex flex-col items-center">
                <img src={combinedImage} alt="Inpainting Result" className="w-full h-full object-cover rounded-lg" />
>>>>>>> feature/fe/42-token-page-ui
              </div>
            )}

            <div className="mt-4 flex flex-col space-y-2">
              {BgImage && (
                <Button type="default" onClick={handleDownloadBgImage} className="w-full">
                  Download Stage Image
                </Button>
              )}

              {canvasImage && (
                <Button type="default" onClick={handleDownloadCanvasImage} className="w-full">
                  Download Canvas Image
                </Button>
              )}
            </div>
          </div>
        )}

        {level === 'Advanced' && (
          <>
            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 샘플링 설정 */}
            <SamplingParams
              scheduler={scheduler}
              samplingSteps={samplingSteps}
<<<<<<< HEAD
              setSamplingSteps={(value: number) => dispatch(setSamplingSteps(value))}
              setScheduler={(value: string) => dispatch(setScheduler(value))}
=======
              setScheduler={setScheduler}
              setSamplingSteps={setSamplingSteps}
>>>>>>> feature/fe/42-token-page-ui
            />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 이미지 크기 설정 */}
<<<<<<< HEAD
            <ImgDimensionParams
              width={width}
              height={height}
              setWidth={(value: number) => dispatch(setWidth(value))}
              setHeight={(value: number) => dispatch(setHeight(value))}
            />
=======
            <ImgDimensionParams width={width} height={height} setWidth={setWidth} setHeight={setHeight} />
>>>>>>> feature/fe/42-token-page-ui

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* guidance scale 설정 */}
<<<<<<< HEAD
            <GuidanceScaleParms
              guidanceScale={guidanceScale}
              setGuidanceScale={(value: number) => dispatch(setGuidanceScale(value))}
            />

            {/* strength 설정 */}
            <StrengthParam strength={strength} setStrength={(value: number) => dispatch(setStrength(value))} />
=======
            <GuidanceScaleParms guidanceScale={guidanceScale} setGuidanceScale={setGuidanceScale} />

            {/* strength 설정 */}
            <StrengthParam strength={strength} setStrength={setStrength} />
>>>>>>> feature/fe/42-token-page-ui

            {/* seed 설정 */}
            <SeedParam
              seed={seed}
              setSeed={(value: number) => dispatch(setSeed(value))}
              isRandomSeed={isRandomSeed}
              handleRandomSeedChange={handleRandomSeedChange}
            />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 배치 설정 */}
            <BatchParams
              batchCount={batchCount}
              batchSize={batchSize}
              setBatchCount={(value: number) => dispatch(setBatchCount(value))}
              setBatchSize={(value: number) => dispatch(setBatchSize(value))}
            />
          </>
        )}
      </div>

      {/* Masking 모달 창 */}
<<<<<<< HEAD
      {showModal && initImageList[0] && (
        <MaskingModal
          imageSrc={initImageList[0]}
          onClose={handleCloseModal}
          setInitImageList={(value: string[]) => {
            dispatch(setInitImageList(value));
          }}
          setMaskImageList={(value: string[]) => {
            dispatch(setMaskImageList(value));
          }}
        />
      )}

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
=======
      {showModal && imageSrc && <InpaintingModal imageSrc={imageSrc} onClose={handleCloseModal} />}
>>>>>>> feature/fe/42-token-page-ui
    </div>
  );
};

export default InpaintingSidebar;
