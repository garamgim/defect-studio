import { RiFolderDownloadLine } from 'react-icons/ri';
import { MdMoveUp } from 'react-icons/md';
import { RiCheckboxMultipleBlankFill, RiCheckboxMultipleBlankLine } from 'react-icons/ri';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { PiEmpty } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';
import { resetOutputs } from '@/store/slices/generation/txt2ImgSlice';
import { useCallback, useState } from 'react';
import { Modal, Select, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { setImageList as setImg2ImgImages } from '../../../store/slices/generation/img2ImgSlice';
import { setInitImageList as setInpaintingImages } from '../../../store/slices/generation/inpaintingSlice';
import { setImageList as setRemoveBgImages } from '../../../store/slices/generation/removeBgSlice';
import { setInitImageList as setCleanupImages } from '../../../store/slices/generation/cleanupSlice';
import { RootState } from '../../../store/store';

interface OutputToolbarProps {
  selectedImgs: string[];
  isSidebarVisible: boolean;
  allSelected: boolean;
  setselectedImgs: (selectedImgs: string[]) => void;
  setIsSidebarVisible: (isSidebarVisible: boolean) => void;
  setAllSelected: (allSelected: boolean) => void;
  allImageUrls: string[];
}

const OutputToolbar = ({
  selectedImgs,
  isSidebarVisible,
  allSelected,
  setselectedImgs,
  setIsSidebarVisible,
  setAllSelected,
  allImageUrls
}: OutputToolbarProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isIconFilled, setIsIconFilled] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFormatModalVisible, setIsFormatModalVisible] = useState(false);
  const [selectedImageFormat, setSelectedImageFormat] = useState<string>('png');

  const { allOutputs } = useSelector((state: RootState) => state.txt2Img);

  const imageFormats = [
    { value: 'png', label: 'PNG' },
    { value: 'jpg', label: 'JPG' },
    { value: 'jpeg', label: 'JPEG' },
    { value: 'bmp', label: 'BMP' }
  ];

  const handleEmptyImgs = () => {
    dispatch(resetOutputs());
  };

  const handleDownloadImages = async () => {
    if (selectedImgs.length === 0) {
      message.warning('Please select at least one image to save.');
      return;
    }
    const folderPath = await window.electron.selectFolder();
    if (!folderPath) {
      message.info('Folder selection was canceled.');
      return;
    }
    const response = await window.electron.saveImgs(selectedImgs, folderPath, selectedImageFormat);
    if (response.success) {
      message.success('Image saved successfully!');
    } else {
      message.error(`Failed to save images: ${response.error}`);
    }
  };

  const toggleSidebarAndPrompt = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showFormatModal = () => {
    setIsFormatModalVisible(true);
  };

  const handleFormatModalOk = () => {
    setIsFormatModalVisible(false);
    handleDownloadImages(); // 형식 선택 후 다운로드 함수 호출
  };

  const handleFormatModalCancel = () => {
    setIsFormatModalVisible(false);
  };

  const routeToActionMap: { [key: string]: (images: string[]) => void } = {
    '/generation/image-to-image': (images) => dispatch(setImg2ImgImages(images)),
    '/generation/inpainting': (images) => dispatch(setInpaintingImages(images)),
    '/generation/remove-background': (images) => dispatch(setRemoveBgImages(images)),
    '/generation/cleanup': (images) => dispatch(setCleanupImages(images))
  };

  const handleSelectAllImages = useCallback(() => {
    console.log(selectedImgs);
    if (allSelected) {
      setselectedImgs([]);
    } else {
      const allImageUrls = allOutputs.outputsInfo
        .map((outputInfo) => outputInfo.imgsUrl) // 각 outputInfo의 imgsUrl 배열 추출
        .flat(); // 중첩 배열을 평탄화하여 하나의 배열로 합침

      setselectedImgs(allImageUrls);
    }
    setAllSelected(!allSelected);
    setIsIconFilled(!isIconFilled);
  }, [allOutputs.outputsInfo, allSelected, isIconFilled]);

  const goToPage = useCallback(
    (path: string) => {
      const action = routeToActionMap[path];
      if (action) {
        action(selectedImgs);
      }
      navigate(path);
      setIsModalVisible(false);
    },
    [navigate, selectedImgs]
  );

  return (
    <>
      {/* 생성된 이미지 도구모음 */}
      <div className="flex flex-col items-center gap-6 w-[46px] text-[#222] py-10 bg-white rounded-[20px] shadow-md border border-gray-300 dark:bg-gray-600 dark:border-none ml-8 overflow-y-auto custom-scrollbar">
        <PiEmpty
          className="flex-shrink-0 w-[22px] h-[22px] dark:text-gray-300 hover:text-blue-500 dark:hover:text-white transition-transform transform hover:scale-110"
          onClick={handleEmptyImgs}
        />
        <RiFolderDownloadLine
          className="flex-shrink-0 w-[22px] h-[22px] dark:text-gray-300 hover:text-blue-500 dark:hover:text-white transition-transform transform hover:scale-110"
          onClick={showFormatModal}
        />
        <MdMoveUp
          className="flex-shrink-0 w-[22px] h-[22px] dark:text-gray-300 cursor-pointer  hover:text-blue-500 dark:hover:text-white transition-transform transform hover:scale-110"
          onClick={showModal}
        />
        {isIconFilled ? (
          <RiCheckboxMultipleBlankLine
            className={`flex-shrink-0 w-[22px] h-[22px] dark:text-gray-300 cursor-pointer  hover:text-blue-500 dark:hover:text-white transition-transform transform hover:scale-110 ${allSelected ? 'text-blue-500' : ''}`}
            onClick={handleSelectAllImages}
          />
        ) : (
          <RiCheckboxMultipleBlankFill
            className={`flex-shrink-0 w-[22px] h-[22px] dark:text-gray-300 cursor-pointer  hover:text-blue-500 dark:hover:text-white transition-transform transform hover:scale-110 ${allSelected ? 'text-blue-500' : ''}`}
            onClick={handleSelectAllImages}
          />
        )}

        {isSidebarVisible ? (
          <AiOutlineEye
            className="flex-shrink-0 w-[22px] h-[22px] dark:text-gray-300 cursor-pointer hover:text-blue-500 dark:hover:text-white transition-transform transform hover:scale-110"
            onClick={toggleSidebarAndPrompt}
          />
        ) : (
          <AiOutlineEyeInvisible
            className="flex-shrink-0 w-[22px] h-[22px] dark:text-gray-300 cursor-pointer hover:text-blue-500 dark:hover:text-white transition-transform transform hover:scale-110"
            onClick={toggleSidebarAndPrompt}
          />
        )}
      </div>

      {/* 이미지 형식 선택 모달 */}
      <Modal open={isFormatModalVisible} closable={false} onOk={handleFormatModalOk} onCancel={handleFormatModalCancel}>
        <div className="text-[20px] mb-[20px] font-semibold dark:text-gray-300">
          Select the format for saving images
        </div>
        <Select value={selectedImageFormat} onChange={setSelectedImageFormat} className="w-full mt-4 mb-10">
          {imageFormats.map((format) => (
            <Select.Option key={format.value} value={format.value}>
              {format.label}
            </Select.Option>
          ))}
        </Select>
      </Modal>

      {/* 액션 선택 모달 */}
      <Modal open={isModalVisible} onCancel={handleCancel} footer={null}>
        <div className="text-[20px] mb-[20px] font-semibold dark:text-gray-300">Select a tab to navigate</div>
        <div className="flex flex-col gap-4 my-10">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
            <Button onClick={() => goToPage('/generation/image-to-image')}>Img2Img</Button>
            <Button onClick={() => goToPage('/generation/inpainting')}>Inpainting</Button>
            <Button onClick={() => goToPage('/generation/remove-background')}>Remove Background</Button>
            <Button onClick={() => goToPage('/generation/cleanup')}>Cleanup</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default OutputToolbar;
