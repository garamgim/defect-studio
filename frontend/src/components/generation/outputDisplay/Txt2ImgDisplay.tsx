import { useDispatch } from 'react-redux';
import { setSelectedImgs } from '../../../store/slices/generation/outputSlice';
import { useTxt2ImgOutputs } from '../../../hooks/generation/outputs/useTxt2ImgOutputs';
import { useEffect, useState } from 'react';
import { Modal, message } from 'antd';
import { FaRegCopy } from 'react-icons/fa6';
import styled from 'styled-components';

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

const Txt2ImgDisplay = () => {
  const dispatch = useDispatch();
  const { output, isLoading, allOutputs, selectedImgs } = useTxt2ImgOutputs();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = (url: string) => {
    const updatedImages = selectedImgs.includes(url)
      ? selectedImgs.filter((imageUrl: string) => imageUrl !== url)
      : [...selectedImgs, url];

    dispatch(setSelectedImgs({ tab: 'txt2Img', value: updatedImages }));
  };

  // 엔터 키를 눌렀을 때 모달을 띄움 (마지막으로 선택된 이미지를 기준으로)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && selectedImgs.length > 0) {
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

  // 프롬프트 복사 함수
  const handleCopy = (prompt: string) => {
    navigator.clipboard.writeText(prompt).then(() => {
      message.success('Prompt copied to clipboard!');
    });
  };

  return (
    <div className="h-full image-display grid gap-4 overflow-y-auto custom-scrollbar2">
      {isLoading ? (
        <div
          className="grid gap-4 mr-[16px]"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))'
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
              <div className="absolute top-0 left-0 w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl border border-gray-300 dark:border-gray-700" />
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))'
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
        <p>No images generated yet.</p>
      )}

      {/* 모달: 마지막으로 선택된 이미지에 대한 프롬프트 표시 */}
      <CustomModal
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        keyboard={true} // ESC 키로 모달 닫기 활성화
      >
        {lastSelectedImage ? (
          <div className="mb-[8px]">
            <div className="mb-3 flex gap-[18px] items-center">
              <span className="text-[20px] dark:text-gray-300 font-semibold">Prompt</span>
              <div
                className="flex items-center text-[14px] text-[#222] hover:text-blue-500 dark:text-gray-300 dark:hover:text-white cursor-pointer transition-transform transform hover:scale-110"
                onClick={() =>
                  handleCopy(
                    allOutputs.outputsInfo.find((output) => output.imgsUrl.includes(lastSelectedImage))?.prompt || ''
                  )
                }
              >
                <FaRegCopy className="mr-1" />
                <span>복사</span>
              </div>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-[16px] leading-relaxed">
              {allOutputs.outputsInfo.find((output) => output.imgsUrl.includes(lastSelectedImage))?.prompt ||
                'No prompt available'}
            </div>
          </div>
        ) : (
          <p>No image selected.</p>
        )}
      </CustomModal>
    </div>
  );
};

export default Txt2ImgDisplay;
