import { useDispatch } from 'react-redux';
import { setSelectedImgs } from '../../../store/slices/generation/outputSlice';
import { useRemoveBgOutputs } from '../../../hooks/generation/outputs/useRemoveBgOutputs';
import { useEffect, useState } from 'react';
import { Modal } from 'antd';
import styled from 'styled-components';
import Loading from '../../../assets/hourglass.gif';

const CustomModal = styled(Modal)`
  html.dark & .ant-modal-content {
    background-color: #1f2937;
    color: #e5e7eb;
    margin: 20px;
  }
  html.dark & .ant-modal-close {
    color: #6b7280;
  }
`;

const RemoveBgDisplay = () => {
  const dispatch = useDispatch();
  const { output, isLoading, allOutputs, selectedImgs } = useRemoveBgOutputs();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = (url: string) => {
    const updatedImages = selectedImgs.includes(url)
      ? selectedImgs.filter((imageUrl: string) => imageUrl !== url)
      : [...selectedImgs, url];

    dispatch(setSelectedImgs({ tab: 'removeBg', value: updatedImages }));
  };

  // 엔터 키를 눌렀을 때 모달을 띄움 (마지막으로 선택된 이미지를 기준으로)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'p' && selectedImgs.length > 0) {
        setIsModalOpen(true); // 모달 열기
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImgs]);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // 선택된 이미지 배열에서 마지막 이미지를 가져오기
  const lastSelectedImage = selectedImgs.length > 0 ? selectedImgs[selectedImgs.length - 1] : null;

  return (
    <div className="h-full image-display grid gap-4 overflow-y-auto custom-scrollbar2">
      {isLoading ? (
        <div
          className="grid gap-4 mr-[16px]"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))'
          }}
        >
          {Array.from({ length: output.imgsCnt }).map((_, index) => (
            <div
              key={index}
              className="relative w-full h-0"
              style={{
                paddingBottom: '100%'
              }}
            >
              {/* 배경 */}
              <div className="absolute top-0 left-0 w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl border border-gray-300 dark:border-gray-700" />

              {/* GIF */}
              <img
                src={Loading}
                alt="Loading GIF"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36"
                style={{
                  filter: 'brightness(0.5)'
                }}
              />
            </div>
          ))}
          {allOutputs.outputsInfo.map((outputInfo) =>
            outputInfo.imgsUrl.map((url, imgIndex) => (
              <div
                key={imgIndex}
                className="relative w-full h-0 cursor-pointer"
                onClick={() => handleImageClick(url)}
                style={{
                  paddingBottom: '100%'
                }}
              >
                <img
                  src={url}
                  alt={`Generated image ${imgIndex}`}
                  className={`absolute top-0 left-0 w-full h-full object-cover rounded-xl ${
                    selectedImgs.includes(url)
                      ? 'border-4 border-blue-500'
                      : 'border border-gray-300 dark:border-gray-700'
                  }`}
                  style={{
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            ))
          )}
        </div>
      ) : allOutputs.outputsCnt > 0 ? (
        <div
          className="grid gap-4 mr-[16px]"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))'
          }}
        >
          {allOutputs.outputsInfo.map((outputInfo) =>
            outputInfo.imgsUrl.map((url, imgIndex) => (
              <div
                key={imgIndex}
                className="relative w-full h-0 cursor-pointer"
                onClick={() => handleImageClick(url)}
                style={{
                  paddingBottom: '100%'
                }}
              >
                <img
                  src={url}
                  alt={`Generated image ${imgIndex}`}
                  className={`absolute top-0 left-0 w-full h-full object-cover rounded-xl ${
                    selectedImgs.includes(url)
                      ? 'border-4 border-blue-500'
                      : 'border border-gray-300 dark:border-gray-700'
                  }`}
                  style={{
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <p className="text-gray-400 dark:text-gray-500">No images generated yet</p>
        </div>
      )}

      {/* 모달: 마지막으로 선택된 이미지에 대한 프롬프트 표시 */}
      <CustomModal
        open={isModalOpen}
        onCancel={() => {
          handleModalClose();
        }}
        footer={null}
        keyboard={true} // ESC 키로 모달 닫기 활성화
      >
        {lastSelectedImage ? (
          <div className="mb-[8px]">
            <img className="rounded-lg mb-4" src={lastSelectedImage} alt="selected Image" />
          </div>
        ) : (
          <p>No image selected.</p>
        )}
      </CustomModal>
    </div>
  );
};

export default RemoveBgDisplay;
