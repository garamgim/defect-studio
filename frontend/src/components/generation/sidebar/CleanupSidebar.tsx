import { useState } from 'react';
import { Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { FormatPainterOutlined } from '@ant-design/icons';
import { RootState } from '../../../store/store';
<<<<<<< HEAD
import MaskingModal from '../masking/MaskingModal';
import UploadImagePlusMask from '../params/UploadImgWithMaskingParams';
import {
  setInitImageList,
  setMaskImageList,
  setInitInputPath,
  setMaskInputPath,
  setOutputPath,
  setMode
} from '../../../store/slices/generation/cleanupSlice';
import { saveImages } from '../../../store/slices/generation/maskingSlice';

const CleanupSidebar = () => {
  const { initInputPath, maskInputPath, outputPath, mode, initImageList } = useSelector(
    (state: RootState) => state.cleanup
  );

  const { combinedImg } = useSelector((state: RootState) => state.masking);

  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
=======
import InpaintingModal from '../masking/MaskingModal';
import UploadImagePlusMask from '../params/UploadImgWithMaskingParams';

const CleanupSidebar: React.FC = () => {
  const BgImage = useSelector((state: RootState) => state.masking.BgImage);
  const canvasImage = useSelector((state: RootState) => state.masking.canvasImage);
  const combinedImage = useSelector((state: RootState) => state.masking.combinedImage);

  const [showModal, setShowModal] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('manual');
>>>>>>> feature/fe/42-token-page-ui

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const img = new Image();
      img.onload = () => {
<<<<<<< HEAD
        dispatch(setInitImageList([base64String]));

        dispatch(
          saveImages({
            backgroundImg: null,
            canvasImg: null,
            combinedImg: null
          })
        );
=======
        setImageSrc(reader.result as string);
>>>>>>> feature/fe/42-token-page-ui
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

<<<<<<< HEAD
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="w-full h-full mr-6">
=======
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
>>>>>>> feature/fe/42-token-page-ui
      <div className="w-full h-full overflow-y-auto custom-scrollbar rounded-[15px] bg-white shadow-lg border border-gray-300 dark:bg-gray-600 dark:border-none">
        {/* 이미지 업로드 */}
        <UploadImagePlusMask
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
      </div>

<<<<<<< HEAD
      {/* Masking 모달 창 */}
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
=======
      {/* ㅡMasking 모달 창 */}
      {showModal && imageSrc && <InpaintingModal imageSrc={imageSrc} onClose={handleCloseModal} />}
>>>>>>> feature/fe/42-token-page-ui
    </div>
  );
};

export default CleanupSidebar;
