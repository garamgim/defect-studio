import { useState } from 'react';
import { Button } from 'antd';
import { FormatPainterOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import Model from '../parameters/Model';
import InpaintingModal from '../masking/MaskingModal';
import SamplingSettings from '../parameters/SamplingSettings';
import ImageDimensions from '../parameters/ImageDimensions';
import GeneralSettings from '../parameters/GeneralSettings';
import BatchSettings from '../parameters/BatchSettings';
import UploadImagePlusMask from '../parameters/UploadImagePlusMask';

const InpaintingSidebar: React.FC = () => {
  // Redux 상태에서 이미지 가져오기
  const stageImage = useSelector((state: RootState) => state.masking.stageImage);
  const canvasImage = useSelector((state: RootState) => state.masking.canvasImage);
  const combinedImage = useSelector((state: RootState) => state.masking.combinedImage);

  const level = useSelector((state: RootState) => state.level) as 'Basic' | 'Advanced';
  const [showModal, setShowModal] = useState(false);
  const [height, setHeight] = useState(512);
  const [width, setWidth] = useState(512);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [samplingMethod, setSamplingMethod] = useState('DPM++ 2M');
  const [samplingSteps, setSamplingSteps] = useState(50);
  const [model, setModel] = useState('Stable Diffusion v1-5');
  const [seed, setSeed] = useState('-1');
  const [isRandomSeed, setIsRandomSeed] = useState(false);
  const [batchCount, setBatchCount] = useState('1');
  const [batchSize, setBatchSize] = useState('1');
  const [activeTab, setActiveTab] = useState<string>('manual');

  const handleRandomSeedChange = () => {
    setIsRandomSeed(!isRandomSeed);
    setSeed(!isRandomSeed ? '-1' : '');
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

  const handleDownloadStageImage = () => {
    handleDownloadImage(stageImage, 'stage_image.png'); // stageImage 다운로드
  };

  const handleDownloadCanvasImage = () => {
    handleDownloadImage(canvasImage, 'canvas_image.png'); // canvasImage 다운로드
  };

  const handleCloseModal = () => {
    setShowModal(false); // 모달 닫기
  };

  return (
    <div className="w-full lg:w-72 h-full fixed-height mr-6">
      <div className="w-full lg:w-72 h-full overflow-y-auto custom-scrollbar rounded-[15px] bg-white shadow-lg border border-gray-300 dark:bg-gray-600 dark:border-none">
        {/* 모델 선택 */}
        <Model model={model} setModel={setModel} />

        <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

        {/* 이미지 업로드 */}
        <UploadImagePlusMask
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
              {stageImage && (
                <Button type="default" onClick={handleDownloadStageImage} className="w-full">
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
            <SamplingSettings
              samplingMethod={samplingMethod}
              samplingSteps={samplingSteps}
              setSamplingMethod={setSamplingMethod}
              setSamplingSteps={setSamplingSteps}
            />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 이미지 크기 설정 */}
            <ImageDimensions width={width} height={height} setWidth={setWidth} setHeight={setHeight} />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 생성 설정 */}
            <GeneralSettings
              guidanceScale={guidanceScale}
              setGuidanceScale={setGuidanceScale}
              seed={seed}
              setSeed={setSeed}
              isRandomSeed={isRandomSeed}
              handleRandomSeedChange={handleRandomSeedChange}
            />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 배치 설정 */}
            <BatchSettings
              batchCount={batchCount}
              batchSize={batchSize}
              setBatchCount={setBatchCount}
              setBatchSize={setBatchSize}
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
