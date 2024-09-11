import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
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
  setBatchSize,
  setImages
} from '../../../store/slices/generation/img2ImgSlice';
import ModelParams from '../params/ModelParam';
import UploadImgParams from '../params/UploadImgParams';
import StrengthParam from '../params/StrengthParam';
import ImgDimensionParams from '../params/ImgDimensionParams';
import SamplingParams from '../params/SamplingParams';
import SeedParam from '../params/SeedParam';
import BatchParams from '../params/BatchParams';
import GuidanceScaleParam from '../params/GuidanceScaleParam';

const Img2ImgSidebar = () => {
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

  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleRandomSeedChange = () => {
    dispatch(setIsRandomSeed(!isRandomSeed));
    dispatch(setSeed(!isRandomSeed ? -1 : seed));
  };


  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string; // 변환된 Base64 문자열
      const img = new Image();
      img.onload = () => {
        setImageSrc(base64String);
        console.log('Base64 String:', base64String); // Base64 문자열 출력
        dispatch(setImages([base64String])); // Redux 상태에 Base64 문자열 저장
      };
      img.src = base64String; // img.src에 Base64 문자열 설정
    };
    reader.readAsDataURL(file); // 파일을 Base64로 변환
  };

  return (
    <div className="w-full h-full fixed-height mr-6">
      <div className="w-full h-full overflow-y-auto custom-scrollbar rounded-[15px] bg-white shadow-lg border border-gray-300 dark:bg-gray-600 dark:border-none">
        {/* 모델 선택 */}
        <ModelParams model={model} setModel={setModel} />

        <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

        {/* 이미지 업로드 */}
        <UploadImgParams handleImageUpload={handleImageUpload} imagePreview={imageSrc} />

        {level === 'Advanced' && (
          <>
            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 이미지 크기 */}
            <ImgDimensionParams width={width} height={height} setWidth={setWidth} setHeight={setHeight} />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 샘플링 세팅 */}
            <SamplingParams
              scheduler={scheduler}
              samplingSteps={samplingSteps}
              setScheduler={setScheduler}
              setSamplingSteps={setSamplingSteps}
            />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 초기 이미지 변화 제어 */}
            <GuidanceScaleParam guidanceScale={guidanceScale} setGuidanceScale={setGuidanceScale} />

            {/* 초기 이미지 변화 제어 */}
            <StrengthParam strength={strength} setStrength={setStrength} />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 이미지 재현/다양성 제어 */}
            <SeedParam
              seed={seed}
              isRandomSeed={isRandomSeed}
              setSeed={(value: number) => dispatch(setSeed(value))}
              handleRandomSeedChange={handleRandomSeedChange}
            />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 배치 세팅 */}
            <BatchParams
              batchCount={batchCount}
              batchSize={batchSize}
              setBatchCount={(value: number) => dispatch(setBatchCount(value))}
              setBatchSize={(value: number) => dispatch(setBatchSize(value))}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Img2ImgSidebar;
