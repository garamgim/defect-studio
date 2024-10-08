import { useState } from 'react';
import { Button, Tooltip, Modal, InputNumber } from 'antd';
import { FormatPainterOutlined } from '@ant-design/icons';
import MaskingModal from '../masking/MaskingModal';
import { useCleanupParams } from '../../../hooks/generation/params/useCleanupParams';
import { setCombinedImg } from '../../../store/slices/generation/inpaintingSlice';
import UploadImgWithMaskingParams from '../params/UploadImgWithMaskingParams';
import { MdMemory } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { setGpuNum } from '../../../store/slices/generation/cleanupSlice';

const CleanupSidebar = () => {
  const dispatch = useDispatch();

  // useSelector와 useCallback으로 처리하는 부분을 커스텀 훅으로 분리
  const {
    mode,
    combinedImg,
    initImageList,
    maskInputPath,
    initInputPath,
    outputPath,
    isZipDownload,
    updateIsZipDownload,
    updateInitImageList,
    updateMaskImageList,
    updateMaskInputPath,
    updateInitInputPath,
    updateOutputPath,
    updateMode,
    updateCombinedImg
  } = useCleanupParams();

  const [isMaskingOpen, setIsMaskingOpen] = useState(false);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const img = new Image();
      img.onload = async () => {
        // 이미지 크기 제한 (2024x2024 이하)
        if (img.width > 2024 || img.height > 2024) {
          alert('The image is too large. Please upload an image with a size less than or equal to 2024x2024.');
          return;
        }
        updateInitImageList([base64String]);
        setCombinedImg(null);
      };

      img.onerror = () => {
        alert('Failed to load the image. Please try again.');
      };
      img.src = base64String;
    };
    reader.onerror = () => {
      alert('Failed to read the file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const closeMasking = () => {
    setIsMaskingOpen(false);
  };

  // GPU 선택
  const [gpuNumer, setGpuNumer] = useState(0);
  const [isGpuModalVisible, setIsGpuModalVisible] = useState(false);

  const showGpuModal = () => {
    setIsGpuModalVisible(true);
  };

  const handleGpuInputChange = (gpuNumer: number | null) => {
    if (gpuNumer) {
      setGpuNumer(gpuNumer);
    }
  };

  const handleGpuModalOk = () => {
    if (gpuNumer !== null) {
      dispatch(setGpuNum(gpuNumer));
    }
    setIsGpuModalVisible(false);
  };

  const handleGpuModalCancel = () => {
    setIsGpuModalVisible(false);
  };

  return (
    <div className="w-full h-full mr-6">
      <div className="relative w-full h-full overflow-y-auto custom-scrollbar rounded-[15px] bg-white shadow-lg border border-gray-300 dark:bg-gray-600 dark:border-none">
        {/* GPU 버튼은 항상 표시 */}
        <div className="absolute top-[22px] right-0 mr-6">
          <Tooltip title="Enter GPU Number">
            <MdMemory
              className="text-[22px] text-[#222] hover:text-blue-500 dark:text-gray-300 dark:hover:text-white cursor-pointer transition-transform transform hover:scale-110"
              onClick={showGpuModal}
            />
          </Tooltip>
        </div>

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
          isZipDownload={isZipDownload}
          updateIsZipDownload={updateIsZipDownload}
        />

        {initImageList[0] && (
          <div className="px-6 pb-10">
            {/* Start Masking 버튼 */}
            {mode === 'manual' && (
              <Button
                type="primary"
                icon={<FormatPainterOutlined />}
                onClick={() => setIsMaskingOpen(true)} // 버튼 클릭 시 모달 열기
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
      <MaskingModal
        isModalOpen={isMaskingOpen}
        imageSrc={initImageList[0]}
        closeModal={closeMasking}
        updateInitImageList={updateInitImageList}
        updateMaskImageList={updateMaskImageList}
        updateCombinedImg={updateCombinedImg}
      />

      {/* gpu 선택 모달 */}
      <Modal open={isGpuModalVisible} closable={false} onOk={handleGpuModalOk} onCancel={handleGpuModalCancel}>
        <div className="text-[20px] mb-[20px] font-semibold dark:text-gray-300">Input the GPU number you want</div>
        <InputNumber min={0} onChange={handleGpuInputChange} />
      </Modal>
    </div>
  );
};

export default CleanupSidebar;
