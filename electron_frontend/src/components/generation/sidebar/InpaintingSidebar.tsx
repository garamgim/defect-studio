import { useState } from 'react';
import { Button } from 'antd';
import { FormatPainterOutlined } from '@ant-design/icons';
import { RootState } from '../../../store/store';
import Model from '../params/ModelParam';
import MaskingModal from '../masking/MaskingModal';
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
  setBatchSize,
  setInitImageList,
  setMaskImageList,
  setClipData
} from '../../../store/slices/generation/inpaintingSlice';
import { getClip } from '../../../api/generation';

const InpaintingSidebar = () => {
  const { backgroundImg, canvasImg, combinedImg } = useSelector((state: RootState) => state.masking);

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
    batchSize,
    initImageList
  } = useSelector((state: RootState) => state.inpainting);

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
      const base64String = reader.result as string; // 변환된 Base64 문자열
      const img = new Image();
      img.onload = async () => {
        setImageSrc(base64String);
        console.log('Base64 String:', base64String); // Base64 문자열 출력

        try {
          // Base64을 Blob으로 변환 후 getClip 호출
          console.log('파일: ', file)
          const response = await getClip([file]); // 파일 배열로 전달
          console.log('결과: ', response)
          dispatch(setClipData(response)); // 클립 결과를 Redux 상태에 저장
        } catch (error) {
          console.error('Failed to get clip data:', error);
        }
      };
      img.src = base64String;
    };
    reader.readAsDataURL(file); // 파일을 Base64로 변환
  };
  
  // const handleDownloadImage = (url: string | null, filename: string) => {
  //   if (url) {
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.download = filename;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }
  // };

  // const handleDownloadbackgroundImg = () => {
  //   handleDownloadImage(backgroundImg, 'stage_image.png'); // backgroundImg 다운로드
  // };

  // const handleDownloadcanvasImg = () => {
  //   handleDownloadImage(canvasImg, 'canvas_image.png'); // canvasImg 다운로드
  // };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleApply = () => {
    if (backgroundImg && canvasImg) {
      dispatch(setInitImageList([backgroundImg]));
      dispatch(setMaskImageList([canvasImg]));
      console.log("확인: ", initImageList)
    }
    setShowModal(false);
  };

  return (
    <div className="w-full h-full mr-6">
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
            {combinedImg && (
              <div className="w-full border border-dashed border-gray-300 rounded-lg mt-4 flex flex-col items-center">
                <img src={combinedImg} alt="Inpainting Result" className="w-full h-full object-cover rounded-lg" />
              </div>
            )}

            {/* <div className="mt-4 flex flex-col space-y-2">
              {backgroundImg && (
                <Button type="default" onClick={handleDownloadbackgroundImg} className="w-full">
                  Download Stage Image
                </Button>
              )}

              {canvasImg && (
                <Button type="default" onClick={handleDownloadcanvasImg} className="w-full">
                  Download Canvas Image
                </Button>
              )}
            </div> */}
          </div>
        )}

        {level === 'Advanced' && (
          <>
            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 샘플링 설정 */}
            <SamplingParams
              scheduler={scheduler}
              samplingSteps={samplingSteps}
              setSamplingSteps={(value: number) => dispatch(setSamplingSteps(value))}
              setScheduler={(value: string) => dispatch(setScheduler(value))}
            />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 이미지 크기 설정 */}
            <ImgDimensionParams
              width={width}
              height={height}
              setWidth={(value: number) => dispatch(setWidth(value))}
              setHeight={(value: number) => dispatch(setHeight(value))}
            />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* guidance scale 설정 */}
            <GuidanceScaleParms
              guidanceScale={guidanceScale}
              setGuidanceScale={(value: number) => dispatch(setGuidanceScale(value))}
            />

            {/* strength 설정 */}
            <StrengthParam strength={strength} setStrength={(value: number) => dispatch(setStrength(value))} />

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
      {showModal && imageSrc && <MaskingModal imageSrc={imageSrc} onClose={handleCloseModal} onApply={handleApply} />}
    </div>
  );
};

export default InpaintingSidebar;
