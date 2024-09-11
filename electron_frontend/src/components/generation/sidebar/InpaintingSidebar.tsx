import { useState } from 'react';
import { Button } from 'antd';
import { FormatPainterOutlined } from '@ant-design/icons';
import { RootState } from '../../../store/store';
import Model from '../params/ModelParam';
import InpaintingModal from '../masking/MaskingModal';
import SamplingParams from '../params/SamplingParams';
import ImgDimensionParams from '../params/ImgDimensionParams';
import SeedParam from '../params/SeedParam';
import BatchParams from '../params/BatchParams';
import StrengthParam from '../params/StrengthParam';
import GuidanceScaleParms from '../params/GuidanceScaleParam';
import UploadImgWithMaskingParams from '../params/UploadImgWithMaskingParams';
import { useSelector, useDispatch } from 'react-redux';
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
  setBatchSize
} from '../../../store/slices/generation/img2ImgSlice';

const InpaintingSidebar: React.FC = () => {
  const { BgImage, canvasImage, combinedImage } = useSelector((state: RootState) => state.masking);

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
    batchSize
  } = useSelector((state: RootState) => state.img2Img);

  const level = useSelector((state: RootState) => state.level) as 'Basic' | 'Advanced';

  const [showModal, setShowModal] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('manual');

  const handleRandomSeedChange = () => {
    setIsRandomSeed(!isRandomSeed);
    setSeed(!isRandomSeed ? -1 : seed);
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        setImageSrc(reader.result as string);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadImage = (url: string | null, filename: string) => {
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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
        {/* 모델 선택 */}
        <Model model={model} setModel={setModel} />

        <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

        {/* 이미지 업로드 */}
        <UploadImgWithMaskingParams
          handleImageUpload={handleImageUpload}
          imagePreview={imageSrc}
          setActiveTab={setActiveTab}
        />

        {imageSrc && (
          <div className="px-6 pb-10">
            {/* Start Masking 버튼 */}
            {activeTab === 'manual' && (
              <Button
                type="primary"
                icon={<FormatPainterOutlined />}
                onClick={() => setShowModal(true)} // 버튼 클릭 시 모달 열기
                className="w-full mt-2"
              >
                Start Masking
              </Button>
            )}

            {/* 인페인팅 결과 및 다운로드 */}
            {combinedImage && (
              <div className="w-full border border-dashed border-gray-300 rounded-lg mt-4 flex flex-col items-center">
                <img src={combinedImage} alt="Inpainting Result" className="w-full h-full object-cover rounded-lg" />
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
              setScheduler={setScheduler}
              setSamplingSteps={setSamplingSteps}
            />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 이미지 크기 설정 */}
            <ImgDimensionParams width={width} height={height} setWidth={setWidth} setHeight={setHeight} />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* guidance scale 설정 */}
            <GuidanceScaleParms guidanceScale={guidanceScale} setGuidanceScale={setGuidanceScale} />

            {/* strength 설정 */}
            <StrengthParam strength={strength} setStrength={setStrength} />

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
      {showModal && imageSrc && <InpaintingModal imageSrc={imageSrc} onClose={handleCloseModal} />}
    </div>
  );
};

export default InpaintingSidebar;
