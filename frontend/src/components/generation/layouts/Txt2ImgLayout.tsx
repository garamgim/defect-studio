import { useState, useCallback, useEffect } from 'react';
import { Modal, Button, Select, message, InputNumber } from 'antd';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/Txt2ImgSidebar';
import PromptParams from '../params/PromptParams';
import Txt2ImgDisplay from '../outputDisplay/Txt2ImgDisplay';
import { useDispatch, useSelector } from 'react-redux';
import {
  setIsNegativePrompt,
  setIsLoading,
  setTaskId,
  setFirstProcessedImg,
  setProcessedImgsCnt,
  setOutputImgs, // 테스트
  setGpuDevice
} from '../../../store/slices/generation/txt2ImgSlice';
import { setImageList as setImg2ImgImages } from '../../../store/slices/generation/img2ImgSlice';
import { setInitImageList as setInpaintingImages } from '../../../store/slices/generation/inpaintingSlice';
import { setImageList as setRemoveBgImages } from '../../../store/slices/generation/removeBgSlice';
import { setInitImageList as setCleanupImages } from '../../../store/slices/generation/cleanupSlice';
import { useTxt2ImgParams } from '../../../hooks/generation/useTxt2ImgParams';
import GenerateButton from '../../common/GenerateButton';
import { RiFolderDownloadLine } from 'react-icons/ri';
import { MdMoveUp } from 'react-icons/md';
import { RiCheckboxMultipleBlankFill, RiCheckboxMultipleBlankLine } from 'react-icons/ri';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { postTxt2ImgGeneration, getTaskStatus } from '../../../api/generation';
import { RootState } from '../../../store/store';
import { MdMemory } from 'react-icons/md';

const Txt2ImgLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { params, isLoading, output, taskId, gpuDevice } = useSelector((state: RootState) => state.txt2Img);
  const { prompt, negativePrompt, isNegativePrompt, updatePrompt, updateNegativePrompt } = useTxt2ImgParams();

  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [isIconFilled, setIsIconFilled] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFormatModalVisible, setIsFormatModalVisible] = useState(false);
  const [selectedImageFormat, setSelectedImageFormat] = useState<string>('png');

  const imageFormats = [
    { value: 'png', label: 'PNG' },
    { value: 'jpg', label: 'JPG' },
    { value: 'jpeg', label: 'JPEG' },
    { value: 'bmp', label: 'BMP' }
  ];

  const handleNegativePromptChange = useCallback(() => {
    dispatch(setIsNegativePrompt(!isNegativePrompt));
  }, [isNegativePrompt, dispatch]);

  const handleGenerate = async () => {
    const data = {
      gpu_device: gpuDevice,
      model: params.modelParams.model,
      scheduler: params.samplingParams.scheduler,
      prompt: params.promptParams.prompt,
      negative_prompt: params.promptParams.negativePrompt,
      width: params.imgDimensionParams.width,
      height: params.imgDimensionParams.height,
      num_inference_steps: params.samplingParams.numInferenceSteps,
      guidance_scale: params.guidanceParams.guidanceScale,
      seed: params.seedParams.seed,
      batch_count: params.batchParams.batchCount,
      batch_size: params.batchParams.batchSize,
      output_path: '' // 추후 settings 페이지 경로 넣을 예정
    };

    try {
      dispatch(setIsLoading(true)); // 로딩 상태 시작
      const newTaskId = await postTxt2ImgGeneration('remote', data); // 이미지 생성 요청 후 taskId 반환
      dispatch(setTaskId(newTaskId)); // taskId 상태에 저장
    } catch (error) {
      if (error instanceof Error) {
        message.error(`Error generating image: ${error.message}`); // 오류 메시지 표시
      } else {
        message.error('An unknown error occurred'); // 알 수 없는 오류 메시지
      }

      dispatch(setIsLoading(false));
    }
  };

  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined; // setInterval을 위한 변수 선언

    // Task 상태를 주기적으로 확인하는 함수
    const fetchTaskStatus = async () => {
      try {
        // 로딩 중이고 taskId가 있을 경우에만 상태 확인
        if (isLoading && taskId) {
          const response = await getTaskStatus(taskId);
          if (response.status === 'SUCCESS') {
            clearInterval(intervalId);
            setFirstProcessedImg(response.data[0]);
            dispatch(setOutputImgs(response.data));
            console.log(output.outputImgs, 'chchchch');
            setProcessedImgsCnt(params.batchParams.batchCount * params.batchParams.batchSize);
          } else if (response.status === 'FAILED') {
            clearInterval(intervalId);
            message.error('Image generation failed');
          }
        }
      } catch (error) {
        console.error('Failed to get task-status:', error);
        clearInterval(intervalId); // 오류 발생 시 주기적 호출 중지
      } finally {
        dispatch(setIsLoading(false));
      }
    };

    if (taskId) {
      fetchTaskStatus(); // 처음 상태 확인
      intervalId = setInterval(fetchTaskStatus, 1000); // 1초마다 상태 확인
    }

    // 컴포넌트가 언마운트되거나 taskId가 변경될 때 setInterval 정리
    return () => clearInterval(intervalId);
  }, [taskId, params.batchParams.batchCount, params.batchParams.batchSize]); // taskId와 batch 파라미터 변화에 따라 useEffect 재실행

  const handleSelectAllImages = useCallback(() => {
    if (allSelected) {
      setSelectedImages([]);
    } else {
      setSelectedImages(output.outputImgs);
    }
    setAllSelected(!allSelected);
    setIsIconFilled(!isIconFilled);
  }, [allSelected, output.outputImgs]);

  const handleDownloadImages = async () => {
    if (selectedImages.length === 0) {
      message.warning('Please select at least one image to save.');
      return;
    }
    const folderPath = await window.electron.selectFolder();
    if (!folderPath) {
      message.info('Folder selection was canceled.');
      return;
    }
    const response = await window.electron.saveImages(selectedImages, folderPath, selectedImageFormat);
    if (response.success) {
      message.success('Image saved successfully!');
    } else {
      message.error(`Failed to save images: ${response.error}`);
    }
  };

  const toggleSidebarAndPrompt = useCallback(() => {
    setIsSidebarVisible(!isSidebarVisible);
  }, [isSidebarVisible]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showFormatModal = () => {
    setIsFormatModalVisible(true);
  };

  const showGpuModal = () => {
    setIsGpuModalVisible(true);
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

  const goToPage = useCallback(
    (path: string) => {
      const action = routeToActionMap[path];
      if (action) {
        action(selectedImages);
      }
      navigate(path);
      setIsModalVisible(false);
    },
    [navigate, selectedImages]
  );

  // GPU 선택
  const [gpuNumber, setGpuNumber] = useState(0);
  const [isGpuModalVisible, setIsGpuModalVisible] = useState(false);

  const handleGpuInputChange = (gpuNumber: number | null) => {
    if (gpuNumber) {
      setGpuNumber(gpuNumber);
    }
  };

  const handleGpuModalOk = () => {
    setGpuDevice(gpuNumber);
    setIsGpuModalVisible(false);
  };

  const handleGpuModalCancel = () => {
    setIsGpuModalVisible(false);
  };

  return (
    <div className="flex h-full pt-4 pb-6">
      {/* 사이드바 */}
      {isSidebarVisible && (
        <div className="w-[360px] pl-8 h-full hidden md:block">
          <Sidebar />
        </div>
      )}

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col px-8 w-full h-full">
        <div className="flex-1 overflow-y-auto custom-scrollbar py-4 pl-4 flex">
          {/* 이미지 디스플레이 */}
          <div className="flex-1">
            <Txt2ImgDisplay selectedImages={selectedImages} setSelectedImages={setSelectedImages} />
          </div>

          {/* 생성된 이미지 도구모음 */}
          <div className="flex flex-col items-center gap-6 w-[46px] text-[#222] py-10 bg-white rounded-[20px] shadow-md border border-gray-300 dark:bg-gray-600 dark:border-none ml-8 overflow-y-auto custom-scrollbar">
            <MdMemory
              className="flex-shrink-0 w-[22px] h-[22px] dark:text-gray-300 hover:text-blue-500 dark:hover:text-white transition-transform transform hover:scale-110"
              onClick={showGpuModal}
            />
            <RiFolderDownloadLine
              className="flex-shrink-0 w-[22px] h-[22px] dark:text-gray-300 hover:text-blue-500 dark:hover:text-white"
              onClick={showFormatModal}
            />
            <MdMoveUp
              className="flex-shrink-0 w-[22px] h-[22px] dark:text-gray-300 cursor-pointer  hover:text-blue-500 dark:hover:text-white"
              onClick={showModal}
            />
            {isIconFilled ? (
              <RiCheckboxMultipleBlankLine
                className={`flex-shrink-0 w-[22px] h-[22px] dark:text-gray-300 cursor-pointer  hover:text-blue-500 dark:hover:text-white ${allSelected ? 'text-blue-500' : ''}`}
                onClick={handleSelectAllImages}
              />
            ) : (
              <RiCheckboxMultipleBlankFill
                className={`flex-shrink-0 w-[22px] h-[22px] dark:text-gray-300 cursor-pointer  hover:text-blue-500 dark:hover:text-white ${allSelected ? 'text-blue-500' : ''}`}
                onClick={handleSelectAllImages}
              />
            )}

            {isSidebarVisible ? (
              <AiOutlineEye
                className="flex-shrink-0 w-[22px] h-[22px] dark:text-gray-300 cursor-pointer hover:text-blue-500 dark:hover:text-white"
                onClick={toggleSidebarAndPrompt}
              />
            ) : (
              <AiOutlineEyeInvisible
                className="flex-shrink-0 w-[22px] h-[22px] dark:text-gray-300 cursor-pointer hover:text-blue-500 dark:hover:text-white"
                onClick={toggleSidebarAndPrompt}
              />
            )}
          </div>
        </div>

        {/* 프롬프트 영역 */}
        {isSidebarVisible && (
          <div className="w-full flex-none mt-6">
            <PromptParams
              prompt={prompt}
              negativePrompt={negativePrompt}
              updatePrompt={updatePrompt}
              updateNegativePrompt={updateNegativePrompt}
              isNegativePrompt={isNegativePrompt}
              handleNegativePromptChange={handleNegativePromptChange}
            />
          </div>
        )}
      </div>

      {/* Generate 버튼 */}
      {isSidebarVisible && (
        <div className="fixed bottom-[50px] right-[56px]">
          <GenerateButton onClick={handleGenerate} disabled={isLoading} />
        </div>
      )}

      {/* gpu 선택 모달 */}
      <Modal open={isGpuModalVisible} closable={false} onOk={handleGpuModalOk} onCancel={handleGpuModalCancel}>
        <div className="text-[20px] mb-[20px] font-semibold dark:text-gray-300">Input the GPU number you want</div>
        <InputNumber min={0} onChange={handleGpuInputChange} />
      </Modal>

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
    </div>
  );
};

export default Txt2ImgLayout;
