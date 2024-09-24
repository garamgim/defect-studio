import { Modal } from 'antd';
import { FaRegCopy } from 'react-icons/fa6';
import styled from 'styled-components';

const CustomModal = styled(Modal)`
  html.dark & .ant-modal-content {
    background-color: #1f2937;
    }
  }
`;

const ImgModal = ({ folder, onClose }) => {
  return (
    <CustomModal
      open={true}
      onCancel={onClose}
      footer={null}
      centered
      width={1000}
      style={{
        height: '80vh', // 화면 높이의 80%
        maxHeight: '80vh'
      }}
    >
      <div className="flex w-full h-full">
        <div className="w-[40%] h-full">
          <div className="flex flex-col">
            {/* 클릭된 이미지 */}
            <img src="path_to_image.jpg" alt="Selected Image" />
            <div>{/* 이미지 리스트 추가 */}</div>
          </div>
        </div>

        <div className="w-[60%] h-full">
          <div className="flex flex-col">
            {/* Prompt Section */}
            <div className="flex flex-col mb-4">
              <div className="flex mb-[10px] gap-[20px] items-center">
                <span>Prompt</span>
                <FaRegCopy />
                <span>복사</span>
              </div>
              <div className="w-full rounded-xl p-2 bg-gray-100 dark:bg-gray-700">
                Generate a high-resolution image of a defective metal product with visible surface cracks. The product
                should have multiple irregular, jagged cracks of varying lengths and depths, clearly indicating stress
                or potential breakage. The lighting should accentuate the texture and depth of the cracks, making them
                prominent. The background should be neutral or slightly blurred, ensuring the focus remains on the
                defective product.
              </div>
            </div>

            {/* Negative Prompt Section */}
            <div className="flex flex-col mb-4">
              <div className="flex mb-[10px] gap-[20px] items-center">
                <span>Negative Prompt</span>
                <FaRegCopy />
                <span>복사</span>
              </div>
              <div className="w-full rounded-xl p-2 bg-gray-100 dark:bg-gray-700">
                Do not include any smooth, undamaged surfaces, pristine conditions, polished or flawless appearances.
                Avoid any vibrant or distracting colors, unnecessary background details, reflections, or shiny surfaces
                that could detract from the visibility of the cracks. Exclude any additional objects or elements that
                are not related to the defective product.
              </div>
            </div>

            {/* Metadata Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <p>생성일</p>
                <div>08/24/2024</div>
              </div>

              <div className="flex flex-col">
                <p>이미지 사이즈</p>
                <div>512 x 512px</div>
              </div>

              <div className="flex flex-col">
                <p>Seed</p>
                <div>3275710632</div>
              </div>

              <div className="flex flex-col">
                <p>Base Model</p>
                <div>6ce0161689</div>
              </div>

              <div className="flex flex-col">
                <p>Sampling Steps</p>
                <div>20</div>
              </div>

              <div className="flex flex-col">
                <p>Guidance Scale</p>
                <div>12.5</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default ImgModal;
