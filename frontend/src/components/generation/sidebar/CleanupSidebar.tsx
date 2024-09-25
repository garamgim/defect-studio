import { useState } from 'react';
import { Button } from 'antd';
import { FormatPainterOutlined } from '@ant-design/icons';
import MaskingModal from '../masking/MaskingModal';
import { useCleanupParams } from '../../../hooks/generation/useCleanupParams';
import { setCombinedImg } from '../../../store/slices/generation/inpaintingSlice';
import UploadImgWithMaskingParams from '../params/UploadImgWithMaskingParams';

const CleanupSidebar = () => {
  // useSelector와 useCallback으로 처리하는 부분을 커스텀 훅으로 분리
  const {
    mode,
    combinedImg,
    initImageList,
    maskInputPath,
    initInputPath,
    outputPath,
    updateInitImageList,
    updateMaskImageList,
    updateMaskInputPath,
    updateInitInputPath,
    updateOutputPath,
    updateMode,
    updateCombinedImg
  } = useCleanupParams();

  const [showModal, setShowModal] = useState(false);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const img = new Image();
      img.onload = () => {
        updateInitImageList([base64String]);

        // 초기 이미지와 마스크 이미지 저장
        setCombinedImg(null);
      };
      img.src = base64String;
    };
    reader.readAsDataURL(file);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="w-full h-full mr-6">
      <div className="w-full h-full overflow-y-auto custom-scrollbar rounded-[15px] bg-white shadow-lg border border-gray-300 dark:bg-gray-600 dark:border-none">
        {/* 이미지 업로드 */}
        <UploadImgWithMaskingParams
          handleImageUpload={handleImageUpload}
          imagePreview={initImageList[0]}
          initInputPath={initInputPath}
          maskInputPath={maskInputPath}
          outputPath={outputPath}
          updateInitInputPath={updateInitInputPath}
          updateMaskInputPath={updateMaskInputPath}
          updateOutputPath={updateOutputPath}
          updateMode={updateMode}
        />

        {initImageList[0] && (
          <div className="px-6 pb-10">
            {/* Start Masking 버튼 */}
            {mode === 'manual' && (
              <Button
                type="primary"
                icon={<FormatPainterOutlined />}
                onClick={() => setShowModal(true)} // 버튼 클릭 시 모달 열기
                className="w-full mt-2"
              >
                Start Masking
              </Button>
            )}

            {/* 인페인팅 결과 */}
            {mode === 'manual' && combinedImg && (
              <div className="w-full border border-dashed border-gray-300 rounded-lg mt-4 flex flex-col items-center">
                <img src={combinedImg} alt="Inpainting Result" className="w-full h-full object-cover rounded-lg" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Masking 모달 창 */}
      {showModal && initImageList[0] && (
        <MaskingModal
          imageSrc={initImageList[0]}
          onClose={handleCloseModal}
          updateInitImageList={updateInitImageList}
          updateMaskImageList={updateMaskImageList}
          updateCombinedImg={updateCombinedImg}
        />
      )}
    </div>
  );
};

export default CleanupSidebar;
