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

interface ImgModalProps {
  folder: unknown; // api통신 데이터 형식 보고 결정
  onClose: () => void;
}

const ImgModal = ({ folder, onClose }: ImgModalProps) => {
  const [messageApi, contextHolder] = message.useMessage();

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        messageApi.success('복사되었습니다!');
      })
      .catch(() => {
        messageApi.error('복사에 실패했습니다.');
      });
  };

  const promptText = `Generate a high-resolution image of a defective metal product with visible surface cracks. The product should have multiple irregular, jagged cracks of varying lengths and depths, clearly indicating stress or potential breakage. The lighting should accentuate the texture and depth of the cracks, making them prominent.`;

  const negativePromptText = `Do not include any smooth, undamaged surfaces, pristine conditions, polished or flawless appearances. Avoid any vibrant or distracting colors, unnecessary background details, reflections, or shiny surfaces that could detract from the visibility of the cracks.`;

  return (
    <CustomModal
      open={true}
      onCancel={onClose}
      footer={null}
      centered
      width={1000}
      style={{
        height: '80vh',
        maxHeight: '80vh'
      }}
    >
      {contextHolder}

      <div className="flex w-full h-full">
        {/* 좌측 이미지 영역 */}
        <div className="w-[40%] flex flex-col h-full p-4">
          <img
            src=""
            alt="selected"
            className="mt-16 mb-8 w-full h-auto rounded-lg object-cover border dark:border-gray-600"
            style={{ minHeight: '300px' }}
          />
          <div className="flex justify-center gap-2">
            {[...Array(5)].map((_, index) => (
              <img
                key={index}
                src=""
                alt={`generated img ${index}`}
                className="w-[60px] h-[60px] rounded-lg object-cover border dark:border-gray-600"
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
                className="flex items-center cursor-pointer text-sm text-gray-400"
                onClick={() => copyToClipboard(promptText)}
              >
                <FaRegCopy className="mr-2" />
                <span>복사</span>
              </div>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm leading-relaxed">{promptText}</div>
          </div>

          {/* Negative Prompt */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-[18px]">Negative Prompt</span>
              <div
                className="flex items-center cursor-pointer text-[14px] text-gray-400"
                onClick={() => copyToClipboard(negativePromptText)}
              >
                <FaRegCopy className="mr-2" />
                <span>복사</span>
              </div>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-[14px] leading-relaxed">
              {negativePromptText}
            </div>
          </div>

          {/* 기타 정보 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex flex-col">
              <span className="text-gray-400 mb-1">생성일</span>
              <span className="font-medium mb-2">08/24/2024</span>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-400 mb-1">이미지 사이즈</span>
              <span className="font-medium mb-2">512 x 512px</span>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-400 mb-1">Seed</span>
              <span className="font-medium mb-2">3275710632</span>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-400 mb-1">Base Model</span>
              <span className="font-medium mb-2">6ce0161689</span>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-400 mb-1">Sampling Steps</span>
              <span className="font-medium mb-2">20</span>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-400 mb-1">Guidance Scale</span>
              <span className="font-medium mb-2">12.5</span>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default ImgModal;
