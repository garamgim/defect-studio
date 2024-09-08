import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import Model from '../parameters/Model';
import UploadImage from '../parameters/UploadImage';
import GeneralSettings from '../parameters/GeneralSettings';
import ImageDimensions from '../parameters/ImageDimensions';
import SamplingSettings from '../parameters/SamplingSettings';
import BatchSettings from '../parameters/BatchSettings';

const Img2ImgSidebar = () => {
  const level = useSelector((state: RootState) => state.level) as 'Basic' | 'Advanced';
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [samplingSteps, setSamplingSteps] = useState(50);
  const [seed, setSeed] = useState('-1');
  const [isRandomSeed, setIsRandomSeed] = useState(false);
  const [samplingMethod, setSamplingMethod] = useState('DPM++ 2M');
  const [, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null);
  const [model, setModel] = useState('Stable Diffusion v1-5');
  const [batchCount, setBatchCount] = useState('1');
  const [batchSize, setBatchSize] = useState('1');

  const handleRandomSeedChange = () => {
    setIsRandomSeed(!isRandomSeed);
    setSeed(!isRandomSeed ? '-1' : '');
  };

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full lg:w-72 h-full fixed-height mr-6">
      <div className="w-full lg:w-72 h-full overflow-y-auto custom-scrollbar rounded-[15px] bg-white shadow-lg border border-gray-300 dark:bg-gray-600 dark:border-none">
        {/* 모델 선택 */}
        <Model model={model} setModel={setModel} />

        <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

        {/* 이미지 업로드 */}
        <UploadImage handleImageUpload={handleImageUpload} imagePreview={imagePreview} />

        {level === 'Advanced' && (
          <>
            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 이미지 크기 */}
            <ImageDimensions width={width} height={height} setWidth={setWidth} setHeight={setHeight} />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 샘플링 세팅 */}
            <SamplingSettings
              samplingMethod={samplingMethod}
              samplingSteps={samplingSteps}
              setSamplingMethod={setSamplingMethod}
              setSamplingSteps={setSamplingSteps}
            />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 일반 세팅 */}
            <GeneralSettings
              guidanceScale={guidanceScale}
              seed={seed}
              isRandomSeed={isRandomSeed}
              setSeed={setSeed}
              setGuidanceScale={setGuidanceScale}
              handleRandomSeedChange={handleRandomSeedChange}
            />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 배치 세팅 */}
            <BatchSettings
              batchCount={batchCount}
              batchSize={batchSize}
              setBatchCount={setBatchCount}
              setBatchSize={setBatchSize}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Img2ImgSidebar;
