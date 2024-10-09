import { Modal, Spin, message } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { FaRegCopy } from 'react-icons/fa6';
import { getImgsDetail } from '../../api/history';
import styled from 'styled-components';
import { Carousel } from 'antd';
import type { CarouselRef } from 'antd/lib/carousel';
import { useState, useRef } from 'react';

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

interface FolderDetailsModalProps {
  folderId: string | null;
  onClose: () => void;
}

const ImageFolderDetail: React.FC<FolderDetailsModalProps> = ({ folderId, onClose }) => {
  const carouselRef = useRef<CarouselRef>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const thumbnailsRef = useRef<HTMLDivElement>(null); // 썸네일 컨테이너 참조
  const isDragging = useRef(false); // 드래그 여부 확인
  const startX = useRef(0); // 드래그 시작 X 좌표
  const scrollLeft = useRef(0); // 드래그 시작 시 스크롤 위치

  const {
    data: folderDetails,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['folderDetail', folderId],
    queryFn: () => getImgsDetail(folderId!),
    enabled: !!folderId
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.success('Copied to clipboard!');
      })
      .catch(() => {
        message.error('Failed to copy.');
      });
  };

  // 썸네일 클릭 시 해당 슬라이드로 이동하는 함수
  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
    if (carouselRef.current) {
      carouselRef.current.goTo(index);
    }
  };

  // 마우스 드래그 시작 시 호출
  const handleMouseDown = (e: React.MouseEvent) => {
    if (thumbnailsRef.current) {
      isDragging.current = true;
      startX.current = e.pageX - thumbnailsRef.current.offsetLeft;
      scrollLeft.current = thumbnailsRef.current.scrollLeft;
    }
  };

  // 마우스 드래그 이동 시 호출
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !thumbnailsRef.current) return;
    e.preventDefault();
    const x = e.pageX - thumbnailsRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // 드래그 속도 조절
    thumbnailsRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // 마우스 드래그 종료 시 호출
  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  if (isLoading) return <Spin />;
  if (isError) return <p>Error loading folder details</p>;

  return (
    <CustomModal
      open={folderId !== null}
      onCancel={onClose}
      footer={null}
      centered
      width={1000}
      style={{
        height: '80vh',
        maxHeight: '80vh'
      }}
    >
      {folderDetails && (
        <div className="flex w-full h-full">
          {/* 좌측 이미지 영역 */}
          <div className="w-[40%] flex flex-col h-full p-4 overflow-hidden">
            {/* 선택된 이미지를 표시하는 캐러셀 */}
            <Carousel ref={carouselRef} autoplay={false} arrows={true} dots={false}>
              {folderDetails.image_url_list.map((url: string, index: number) => (
                <div key={index}>
                  <img
                    src={url}
                    alt={`Generated Image ${index + 1}`}
                    className="mt-16 mb-8 w-full h-auto rounded-lg object-cover border dark:border-gray-600"
                    style={{ minHeight: '300px' }}
                  />
                </div>
              ))}
            </Carousel>

            {/* 썸네일 영역 */}
            <div
              ref={thumbnailsRef}
              className="flex gap-2 overflow-x-auto cursor-grab scrollbar-hide"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              style={{ userSelect: 'none' }} // 드래그 시 텍스트 선택 방지
            >
              {folderDetails.image_url_list.map((url: string, index: number) => (
                <img
                  key={index}
                  src={url}
                  alt={`generated img ${index}`}
                  className={`w-[60px] h-[60px] rounded-lg object-cover border cursor-pointer ${
                    selectedImageIndex === index ? 'border-blue-500' : 'dark:border-gray-600'
                  }`}
                  onClick={() => handleThumbnailClick(index)} // 클릭 시 슬라이드 이동
                />
              ))}
            </div>
          </div>

          {/* 우측 프롬프트 영역 */}
          <div className="w-[60%] h-full p-6 overflow-y-auto">
            {/* Prompt */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-[18px]">Prompt</span>
                <div
                  className="flex items-center cursor-pointer text-[14px] hover:text-[#222] text-gray-400 dark:hover:text-white transition-transform transform hover:scale-110"
                  onClick={() => copyToClipboard(folderDetails.prompt || '')}
                >
                  <FaRegCopy className="mr-2" />
                  <span>Copy</span>
                </div>
              </div>
              {folderDetails.prompt ? (
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-[14px] leading-relaxed">
                  {folderDetails.prompt}
                </div>
              ) : (
                <div className="p-4 text-gray-300 dark:text-gray-500 text-center bg-gray-100 dark:bg-gray-700 rounded-lg text-[14px] leading-relaxed">
                  Prompt does not exist.
                </div>
              )}
            </div>

            {/* Negative Prompt */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-[18px]">Negative Prompt</span>
                <div
                  className="flex items-center cursor-pointer text-[14px] hover:text-[#222] text-gray-400 dark:hover:text-white transition-transform transform hover:scale-110"
                  onClick={() => copyToClipboard(folderDetails.negative_prompt || '')}
                >
                  <FaRegCopy className="mr-2" />
                  <span>Copy</span>
                </div>
              </div>
              {folderDetails.negative_prompt ? (
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-[14px] leading-relaxed">
                  {folderDetails.negative_prompt}
                </div>
              ) : (
                <div className="p-4 text-gray-300 dark:text-gray-500 text-center bg-gray-100 dark:bg-gray-700 rounded-lg text-[14px] leading-relaxed">
                  Negative Prompt does not exist.
                </div>
              )}
            </div>

            {/* 기타 정보 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-[14px]">
              <div className="flex flex-col">
                <span className="text-gray-400 mb-1">Generation Type</span>
                <span className="font-medium mb-2">{folderDetails.generation_type}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-gray-400 mb-1">Date</span>
                <span className="font-medium mb-2">{folderDetails.date.slice(0, 19).replace('T', ' ')}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-gray-400 mb-1">Image Size</span>
                <span className="font-medium mb-2">
                  {folderDetails.width} x {folderDetails.height}px
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-gray-400 mb-1">Seed</span>
                <span className="font-medium mb-2">{folderDetails.seed}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-gray-400 mb-1">Model</span>
                <span className="font-medium mb-2">{folderDetails.model}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-gray-400 mb-1">Scheduler</span>
                <span className="font-medium mb-2">{folderDetails.scheduler}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </CustomModal>
  );
};

export default ImageFolderDetail;
