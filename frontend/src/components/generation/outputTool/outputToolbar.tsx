import { RiFolderDownloadLine } from 'react-icons/ri';
import { MdMoveUp } from 'react-icons/md';
import { RiCheckboxMultipleBlankFill, RiCheckboxMultipleBlankLine } from 'react-icons/ri';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { PiEmpty } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useState } from 'react';
import { Modal, Select, Button, message, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  resetOutputs,
  setSelectedImgs,
  setIsAllSelected,
  setIsSidebarVisible
} from '../../../store/slices/generation/outputSlice';
import { RootState } from '../../../store/store';
import { setImageList as txtSetImageList } from '../../../store/slices/generation/img2ImgSlice';
import { setInitImageList as inpaintingSetImageList } from '../../../store/slices/generation/inpaintingSlice';
import { setImageList as removeSetImageList } from '../../../store/slices/generation/removeBgSlice';
import { setInitImageList as cleanupSetImageList } from '../../../store/slices/generation/cleanupSlice';

interface OutputToolbarProps {
  type: 'txt2Img' | 'img2Img' | 'inpainting' | 'removeBg' | 'cleanup';
}

const OutputToolbar = ({ type }: OutputToolbarProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isIconFilled, setIsIconFilled] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFormatModalVisible, setIsFormatModalVisible] = useState(false);
  const [selectedImageFormat, setSelectedImageFormat] = useState<string>('png');

  // 해당 타입의 state를 불러옵니다.
  const { allOutputs, selectedImgs, isAllSelected, isSidebarVisible } = useSelector(
    (state: RootState) => state.generatedOutput[type]
  );

  const imageFormats = [
    { value: 'png', label: 'PNG' },
    { value: 'jpg', label: 'JPG' },
    { value: 'jpeg', label: 'JPEG' },
    { value: 'bmp', label: 'BMP' }
  ];

  const handleEmptyImgs = () => {
    dispatch(resetOutputs(type));
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
    dispatch(setIsSidebarVisible({ tab: type, value: !isSidebarVisible }));
  };

  const showModal = () => {
    if (selectedImgs.length !== 1) {
      message.error('Please choose one image');
    } else {
      setIsModalVisible(true);
    }
  };

  const handleTabSelect = (tab: string, route: string) => {
    switch (tab) {
      case 'txt2Img':
        dispatch(txtSetImageList(selectedImgs));
        break;
      case 'inpainting':
        dispatch(inpaintingSetImageList(selectedImgs));
        break;
      case 'removeBg':
        dispatch(removeSetImageList(selectedImgs));
        break;
      case 'cleanup':
        dispatch(cleanupSetImageList(selectedImgs));
        break;
      default:
        message.error('Invalid type selected');
        return;
    }

    goToPage(route);
    setIsModalVisible(false);
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

  const handleSelectAllImages = useCallback(() => {
    if (isAllSelected) {
      dispatch(setSelectedImgs({ tab: type, value: [] }));
    } else {
      const allImageUrls = allOutputs.outputsInfo.map((outputInfo) => outputInfo.imgsUrl).flat();
      dispatch(setSelectedImgs({ tab: type, value: allImageUrls }));
    }
    dispatch(setIsAllSelected({ tab: type, value: !isAllSelected }));
    setIsIconFilled(!isIconFilled);
  }, [allOutputs.outputsInfo, isAllSelected, isIconFilled, type, dispatch]);

  const goToPage = useCallback(
    (path: string) => {
      navigate(path);
      setIsModalVisible(false);
    },
    [navigate]
  );

  return (
    <>
      {/* 생성된 이미지 도구 모음 */}
      <div className="max-h-[320px] flex flex-col justify-center items-center gap-7 w-[46px] text-[#222] bg-white rounded-[20px] shadow-md border border-gray-300 dark:bg-gray-600 dark:border-none ml-8 overflow-y-auto custom-scrollbar p-2">
        <Tooltip title="Clear">
          <PiEmpty
            className="flex-shrink-0 w-[21px] h-[21px] dark:text-gray-300 hover:text-blue-500 dark:hover:text-white transition-transform transform hover:scale-110"
            onClick={handleEmptyImgs}
          />
        </Tooltip>

        <Tooltip title="Download">
          <RiFolderDownloadLine
            className="flex-shrink-0 w-[21px] h-[21px] dark:text-gray-300 hover:text-blue-500 dark:hover:text-white transition-transform transform hover:scale-110"
            onClick={showFormatModal}
          />
        </Tooltip>

        <Tooltip title="Move Image">
          <MdMoveUp
            className="flex-shrink-0 w-[21px] h-[21px] dark:text-gray-300 cursor-pointer  hover:text-blue-500 dark:hover:text-white transition-transform transform hover:scale-110"
            onClick={showModal}
          />
        </Tooltip>

        {isIconFilled ? (
          <Tooltip title="Select All">
            <RiCheckboxMultipleBlankLine
              className={`flex-shrink-0 w-[21px] h-[21px] dark:text-gray-300 cursor-pointer  hover:text-blue-500 dark:hover:text-white transition-transform transform hover:scale-110 ${isAllSelected ? 'text-blue-500' : ''}`}
              onClick={handleSelectAllImages}
            />
          </Tooltip>
        ) : (
          <Tooltip title="Unselect All">
            <RiCheckboxMultipleBlankFill
              className={`flex-shrink-0 w-[21px] h-[21px] dark:text-gray-300 cursor-pointer  hover:text-blue-500 dark:hover:text-white transition-transform transform hover:scale-110 ${isAllSelected ? 'text-blue-500' : ''}`}
              onClick={handleSelectAllImages}
            />
          </Tooltip>
        )}
        {/* 사이드바 숨김 도구 */}
        {isSidebarVisible ? (
          <Tooltip title="Hide Sidebar">
            <AiOutlineEye
              className="flex-shrink-0 w-[21px] h-[21px] dark:text-gray-300 cursor-pointer hover:text-blue-500 dark:hover:text-white transition-transform transform hover:scale-110"
              onClick={toggleSidebarAndPrompt}
            />
          </Tooltip>
        ) : (
          <Tooltip title="Show Sidebar">
            <AiOutlineEyeInvisible
              className="flex-shrink-0 w-[21px] h-[21px] dark:text-gray-300 cursor-pointer hover:text-blue-500 dark:hover:text-white transition-transform transform hover:scale-110"
              onClick={toggleSidebarAndPrompt}
            />
          </Tooltip>
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

      {/* 이미지 선택 후 탭 이동 모달 */}
      <Modal open={isModalVisible} onCancel={handleCancel} footer={null}>
        <div className="text-[20px] mb-[20px] font-semibold dark:text-gray-300">Select a tab to navigate</div>
        <div className="flex flex-col gap-4 my-10">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
            <Button onClick={() => handleTabSelect('txt2Img', '/generation/image-to-image')}>Img2Img</Button>
            <Button onClick={() => handleTabSelect('inpainting', '/generation/inpainting')}>Inpainting</Button>
            <Button onClick={() => handleTabSelect('removeBg', '/generation/remove-background')}>
              Remove Background
            </Button>
            <Button onClick={() => handleTabSelect('cleanup', '/generation/cleanup')}>Cleanup</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default OutputToolbar;
