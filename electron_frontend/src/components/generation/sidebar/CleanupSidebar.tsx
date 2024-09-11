import { useState } from 'react';
import { Button } from 'antd';
import { FormatPainterOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import InpaintingModal from '../masking/MaskingModal';
import UploadImagePlusMask from '../params/UploadImgWithMaskingParams';

const CleanupSidebar: React.FC = () => {
  const BgImage = useSelector((state: RootState) => state.masking.BgImage);
  const canvasImage = useSelector((state: RootState) => state.masking.canvasImage);
  const combinedImage = useSelector((state: RootState) => state.masking.combinedImage);

  const [showModal, setShowModal] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('manual');

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

      {/* ㅡMasking 모달 창 */}
      {showModal && imageSrc && <InpaintingModal imageSrc={imageSrc} onClose={handleCloseModal} />}
    </div>
  );
};

export default CleanupSidebar;
