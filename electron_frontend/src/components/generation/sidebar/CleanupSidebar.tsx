import { useState } from 'react';
import { Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { FormatPainterOutlined } from '@ant-design/icons';
import { RootState } from '../../../store/store';
import MaskingModal from '../masking/MaskingModal';
import UploadImagePlusMask from '../params/UploadImgWithMaskingParams';
import { setImages, setMasks } from '../../../store/slices/generation/cleanupSlice';

const CleanupSidebar = () => {
  const { backgroundImg, canvasImg, combinedImg } = useSelector((state: RootState) => state.masking);

  const dispatch = useDispatch();
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

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleApply = () => {
    if (backgroundImg && canvasImg) {
      dispatch(setImages([backgroundImg]));
      dispatch(setMasks([canvasImg]));
    }
    setShowModal(false);
  };

  return (
    <div className="w-full h-full mr-6">
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
            {combinedImg && (
              <div className="w-full border border-dashed border-gray-300 rounded-lg mt-4 flex flex-col items-center">
                <img src={combinedImg} alt="Inpainting Result" className="w-full h-full object-cover rounded-lg" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Masking 모달 창 */}
      {showModal && imageSrc && <MaskingModal imageSrc={imageSrc} onClose={handleCloseModal} onApply={handleApply} />}
    </div>
  );
};

export default CleanupSidebar;
