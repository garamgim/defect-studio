import { useState } from 'react';
import { Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { FormatPainterOutlined } from '@ant-design/icons';
import { RootState } from '../../../store/store';
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
  const { initInputPath, maskInputPath, outputPath, mode } = useSelector((state: RootState) => state.cleanup);

  const { combinedImg } = useSelector((state: RootState) => state.masking);

  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const img = new Image();
      img.onload = () => {
        setImageSrc(base64String);
        dispatch(setInitImageList([base64String]));

        dispatch(
          saveImages({
            backgroundImg: null,
            canvasImg: null,
            combinedImg: null
          })
        );
      };
      img.src = reader.result as string;
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
        <UploadImagePlusMask
          handleImageUpload={handleImageUpload}
          imagePreview={imageSrc}
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
        />

        {imageSrc && (
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
      {showModal && imageSrc && (
        <MaskingModal
          imageSrc={imageSrc}
          onClose={handleCloseModal}
          setInitImageList={(value: string[]) => {
            dispatch(setInitImageList(value));
          }}
          setMaskImageList={(value: string[]) => {
            dispatch(setMaskImageList(value));
          }}
        />
      )}
    </div>
  );
};

export default CleanupSidebar;
