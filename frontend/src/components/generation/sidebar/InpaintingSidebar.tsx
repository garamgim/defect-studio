import { Button } from 'antd';
import { FormatPainterOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import Model from '../parameters/Model';
import InpaintingModal from '../inpainting/InpaintingModal';
import SamplingSettings from '../parameters/SamplingSettings';
import ImageDimensions from '../parameters/ImageDimensions';
import GeneralSettings from '../parameters/GeneralSettings';
import BatchSettings from '../parameters/BatchSettings';
import UploadImage from '../parameters/UploadImage';

const InpaintingSidebar = () => {
  const level = useSelector((state: RootState) => state.level) as 'Basic' | 'Advanced';
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [height, setHeight] = useState(512);
  const [width, setWidth] = useState(512);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [samplingMethod, setSamplingMethod] = useState('DPM++ 2M');
  const [samplingSteps, setSamplingSteps] = useState(50);
  const [model, setModel] = useState('Stable Diffusion v1-5');
  const [seed, setSeed] = useState('-1');
  const [isRandomSeed, setIsRandomSeed] = useState(false);
  const [batchCount, setBatchCount] = useState('1');
  const [batchSize, setBatchSize] = useState('1');
  const [inpaintingResult, setInpaintingResult] = useState<string | null>(null);
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
        let newWidth = img.width;
        let newHeight = img.height;

        if (img.width > img.height) {
          newWidth = 512;
          newHeight = (img.height / img.width) * 512;
        } else {
          newHeight = 512;
          newWidth = (img.width / img.height) * 512;
        }

        setWidth(newWidth);
        setHeight(newHeight);
        setImageSrc(reader.result as string);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleApplyMask = (maskCanvas: HTMLCanvasElement) => {
    setShowModal(false);
    const dataUrl = maskCanvas.toDataURL();
    setInpaintingResult(dataUrl);
  };

  const handleDownload = () => {
    if (inpaintingResult) {
      const link = document.createElement('a');
      link.href = inpaintingResult;
      link.download = 'inpainting_result.png';
      link.click();
    }
  };

  return (
    <div className="w-full lg:w-72 h-full fixed-height mr-6">
      <div className="w-full lg:w-72 h-full overflow-y-auto custom-scrollbar rounded-[15px] bg-white shadow-lg border border-gray-300">
        {/* 모델 선택 */}
        <Model model={model} setModel={setModel} />

        <hr className="border-t-[2px] border-[#E6E6E6] w-full" />

        {/* 이미지 업로드 */}
        <UploadImage
          handleImageUpload={handleImageUpload}
          imagePreview={imageSrc}
          showInpaintingInput={true}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {imageSrc && (
          <div className="px-6 pb-10">
            {/* Inpainting 버튼 */}
            {activeTab === 'manual' && (
              <Button
                type="primary"
                icon={<FormatPainterOutlined />}
                onClick={() => setShowModal(true)}  // 모달 창 열림
                className="w-full mt-2"
              >
                Start Inpainting
              </Button>
            )}

            {/* 인페인팅 작업 결과 이미지 표시 */}
            {inpaintingResult && (
              <div className="relative w-full pb-[61.8%] bg-gray-100 border border-dashed border-gray-300 rounded-lg mt-4 flex items-center justify-center">
                <img
                  src={imageSrc}
                  alt="Original Image"
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                  style={{ opacity: 0.5 }}
                />

                <img
                  src={inpaintingResult}
                  alt="Inpainting Result"
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                />
              </div>
            )}

            {/* 다운로드 버튼 */}
            {inpaintingResult && (
              <Button type="default" onClick={handleDownload} className="mt-2">
                Download Result
              </Button>
            )}
          </div>
        )}

        {level === 'Advanced' && (
          <>
            <hr className="border-t-[2px] border-[#E6E6E6] w-full" />

            {/* 샘플링 설정 */}
            <SamplingSettings
              samplingMethod={samplingMethod}
              samplingSteps={samplingSteps}
              setSamplingMethod={setSamplingMethod}
              setSamplingSteps={setSamplingSteps}
            />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full" />

            {/* 이미지 크기 설정 */}
            <ImageDimensions width={width} height={height} setWidth={setWidth} setHeight={setHeight} />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full" />

            {/* 생성 설정 */}
            <GeneralSettings
              guidanceScale={guidanceScale}
              setGuidanceScale={setGuidanceScale}
              seed={seed}
              setSeed={setSeed}
              isRandomSeed={isRandomSeed}
              handleRandomSeedChange={handleRandomSeedChange}
            />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full" />

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

      {/* Inpainting 모달 창 */}
      {showModal && imageSrc && (
        <InpaintingModal
          imageSrc={imageSrc}
          onClose={() => setShowModal(false)}
          onApply={handleApplyMask}
          width={width}
          height={height}
        />
      )}
    </div>
  );
};

export default InpaintingSidebar;
