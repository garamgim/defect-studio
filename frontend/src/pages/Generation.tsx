import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
const TextToImage = lazy(() => import('../components/generation/layouts/Txt2ImgLayout'));
const ImageToImage = lazy(() => import('../components/generation/layouts/Img2ImgLayout'));
const Inpainting = lazy(() => import('../components/generation/layouts/InpaintingLayout'));
const RemoveBackground = lazy(() => import('../components/generation/layouts/RemoveBgLayout'));
const Cleanup = lazy(() => import('../components/generation/layouts/CleanupLayout'));
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai';
import LoadingIndicator from '@pages/LoadingIndicator';
import { FaImage, FaMagic, FaPaintBrush, FaEraser, FaTrash, FaSpinner, FaCircle } from 'react-icons/fa';

import { useDispatch, useSelector } from 'react-redux';
import {
  setIsCheckedOutput,
  setOutputImgsUrl,
  setAllOutputsInfo,
  setIsLoading,
  setTaskId
} from '../store/slices/generation/outputSlice';

import { useTxt2ImgOutputs } from '../hooks/generation/outputs/useTxt2ImgOutputs';
import { useImg2ImgOutputs } from '../hooks/generation/outputs/useImg2ImgOutputs';
import { useInpaintingOutputs } from '../hooks/generation/outputs/useInpaintingOutputs';
import { useRemoveBgOutputs } from '../hooks/generation/outputs/useRemoveBgOutputs';
import { useCleanupOutputs } from '../hooks/generation/outputs/useCleanupOutputs';
import { getTaskStatus } from '../api/generation';
import { RootState } from '@/store/store';
import { upDateMyInfo } from '@/api/user';

const Generation = () => {
  const dispatch = useDispatch();

  // 'cleanup' 탭을 제외한 나머지 탭들
  const tabs: Array<keyof Omit<RootState['generatedOutput'], 'clip'>> = [
    'txt2Img',
    'img2Img',
    'inpainting',
    'removeBg',
    'cleanup'
  ];

  // generatedOutput에서 각 탭의 상태 가져오기
  const tabsState = useSelector((state: RootState) => tabs.map((tab) => state.generatedOutput[tab]));

  useEffect(() => {
    const fetchTaskStatusForTabs = async () => {
      for (let index = 0; index < tabsState.length; index++) {
        const tabState = tabsState[index];
        const tabName = tabs[index];

        if (!tabState) continue;

        const { taskId, isLoading, allOutputs, output } = tabState;

        if (taskId && isLoading) {
          try {
            dispatch(setIsCheckedOutput({ tab: tabName, value: false }));
            const response = await getTaskStatus(taskId);

            if (response.task_status === 'SUCCESS') {
              dispatch(setOutputImgsUrl({ tab: tabName, value: response.result_data }));

              const outputsCnt = allOutputs.outputsCnt + output.imgsCnt;
              const outputsInfo = [
                {
                  id: response.result_data_log.id,
                  imgsUrl: response.result_data,
                  prompt: response.result_data_log.prompt
                },
                ...allOutputs.outputsInfo
              ];

              dispatch(setAllOutputsInfo({ tab: tabName, outputsCnt, outputsInfo }));
              dispatch(setIsLoading({ tab: tabName, value: false }));
              dispatch(setTaskId({ tab: tabName, value: null }));
              upDateMyInfo();
            } else if (response.detail && response.detail.task_status === 'FAILURE') {
              dispatch(setIsLoading({ tab: tabName, value: false }));
              dispatch(setTaskId({ tab: tabName, value: null }));
              console.error('Image generation failed:', response.detail.result_data || 'Unknown error');
              alert(`Image generation failed: ${response.detail.result_data || 'Unknown error'}`);
            }
          } catch (error) {
            console.error(`Failed to get task status for ${tabName}:`, error);
            dispatch(setIsLoading({ tab: tabName, value: false }));
          }
        }
      }
    };

    const intervalId = setInterval(fetchTaskStatusForTabs, 1000); // 주기적으로 각 탭의 상태 확인

    // 컴포넌트 언마운트 시 clearInterval 호출
    return () => clearInterval(intervalId);
  }, [dispatch, tabsState]); // 모든 탭 상태를 의존성으로 추가

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation(); // 현재 경로 감지

  // 각 탭의 로딩 상태와 체크 상태를 가져옴
  const { isLoading: txt2imgLoading, isCheckedOutput: txt2imgChecked } = useTxt2ImgOutputs();
  const { isLoading: img2imgLoading, isCheckedOutput: img2imgChecked } = useImg2ImgOutputs();
  const { isLoading: inpaintingLoading, isCheckedOutput: inpaintingChecked } = useInpaintingOutputs();
  const { isLoading: removeBgLoading, isCheckedOutput: removeBgChecked } = useRemoveBgOutputs();
  const { isLoading: cleanupLoading, isCheckedOutput: cleanupChecked } = useCleanupOutputs();

  // 사이드바 열림/닫힘 상태 관리
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 탭 변경 시 isCheckedOutput 업데이트
  useEffect(() => {
    switch (location.pathname) {
      case '/generation/text-to-image':
        if (!txt2imgChecked) {
          dispatch(setIsCheckedOutput({ tab: 'txt2Img', value: true }));
        }
        break;
      case '/generation/image-to-image':
        if (!img2imgChecked) {
          dispatch(setIsCheckedOutput({ tab: 'img2Img', value: true }));
        }
        break;
      case '/generation/inpainting':
        if (!inpaintingChecked) {
          dispatch(setIsCheckedOutput({ tab: 'inpainting', value: true }));
        }
        break;
      case '/generation/remove-background':
        if (!removeBgChecked) {
          dispatch(setIsCheckedOutput({ tab: 'removeBg', value: true }));
        }
        break;
      case '/generation/cleanup':
        if (!cleanupChecked) {
          dispatch(setIsCheckedOutput({ tab: 'cleanup', value: true }));
        }
        break;
      default:
        break;
    }
  }, [location.pathname, dispatch, txt2imgChecked, img2imgChecked, inpaintingChecked, removeBgChecked, cleanupChecked]);

  // 각 탭의 아이콘 옆에 표시할 상태 아이콘 (로딩 중 vs 로딩 완료 vs 체크 안된 상태)
  const renderStatusIcon = (isLoading: boolean, isCheckedOutput: boolean) => {
    if (isLoading) {
      return <FaSpinner className="absolute w-[12px] top-0 left-[10px] text-black dark:text-white animate-spin" />;
    } else if (!isCheckedOutput) {
      return <FaCircle className="absolute w-[6px] top-0 left-[14px] text-red-500" />;
    }
    return null;
  };

  return (
    <div className="flex h-[calc(100vh-60px)] bg-gray-100 dark:bg-gray-800">
      {/* 사이드 메뉴탭 선택 */}
      <div
        className={`fixed top-0 left-0 bg-white shadow-lg z-20 h-full transition-transform duration-300 ease-in-out overflow-y-auto custom-scrollbar pb-[150px] ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-20 dark:bg-gray-800 dark:border-r dark:border-gray-600 border-gray-300`}
        style={{ top: '60px' }}
      >
        <nav className="flex flex-col items-center">
          <div className="mt-6 flex flex-col items-center space-y-8">
            {/* Txt2Img Tab */}
            <Link
              to="text-to-image"
              className="relative flex flex-col justify-center items-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition duration-300 px-4 w-full py-2 dark:hover:bg-gray-900"
            >
              <FaImage className="w-[20px] h-[20px] dark:text-slate-400" />
              {renderStatusIcon(txt2imgLoading, txt2imgChecked)}
              <span className="flex text-[12px] mt-1 dark:text-slate-400">Txt2Img</span>
            </Link>

            {/* Img2Img Tab */}
            <Link
              to="image-to-image"
              className="relative flex flex-col justify-center items-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition duration-300 px-4 w-full py-2 dark:hover:bg-gray-900"
            >
              <FaMagic className="w-[20px] h-[20px] dark:text-slate-400" />
              {renderStatusIcon(img2imgLoading, img2imgChecked)}
              <span className="flex text-[12px] mt-1 dark:text-slate-400">Img2Img</span>
            </Link>

            {/* Inpainting Tab */}
            <Link
              to="inpainting"
              className="relative flex flex-col justify-center items-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition duration-300 px-4 w-full py-2 dark:hover:bg-gray-900"
            >
              <FaPaintBrush className="w-[20px] h-[20px] dark:text-slate-400" />
              {renderStatusIcon(inpaintingLoading, inpaintingChecked)}
              <span className="flex text-[12px] mt-1 dark:text-slate-400">Inpaint</span>
            </Link>

            {/* Remove Background Tab */}
            <Link
              to="remove-background"
              className="relative flex flex-col justify-center items-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition duration-300 px-4 w-full py-2 dark:hover:bg-gray-900"
            >
              <FaEraser className="w-[20px] h-[20px] dark:text-slate-400" />
              {renderStatusIcon(removeBgLoading, removeBgChecked)}
              <span className="flex text-[12px] mt-1 text-center dark:text-slate-400">Remove BG</span>
            </Link>

            {/* Cleanup Tab */}
            <Link
              to="cleanup"
              className="relative flex flex-col justify-center items-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition duration-300 px-4 w-full py-2 dark:hover:bg-gray-900"
            >
              <FaTrash className="w-[20px] h-[20px] dark:text-slate-400" />
              {renderStatusIcon(cleanupLoading, cleanupChecked)}
              <span className="flex text-[12px] mt-1 dark:text-slate-400">Cleanup</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* 사이드 닫고 열기 버튼 */}
      <button
        onClick={toggleSidebar}
        className="fixed bottom-4 left-4 w-12 h-12 rounded-full bg-white shadow-lg border border-[#757575] flex items-center justify-center z-30 focus:outline-none dark:bg-gray-300"
      >
        {isSidebarOpen ? (
          <AiOutlineMenuUnfold className="text-gray-500 text-2xl" />
        ) : (
          <AiOutlineMenuFold className="text-gray-500 text-2xl" />
        )}
      </button>

      {/* 메인 컴포넌트 렌더링 */}
      <div
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-20' : 'ml-0'} h-full`}
        style={{ marginLeft: isSidebarOpen ? '80px' : '0' }}
      >
        <Routes>
          <Route
            path="text-to-image"
            element={
              <Suspense fallback={<LoadingIndicator />}>
                <TextToImage />
              </Suspense>
            }
          />
          <Route
            path="image-to-image"
            element={
              <Suspense fallback={<LoadingIndicator />}>
                <ImageToImage />
              </Suspense>
            }
          />
          <Route
            path="inpainting"
            element={
              <Suspense fallback={<LoadingIndicator />}>
                <Inpainting />
              </Suspense>
            }
          />
          <Route
            path="remove-background"
            element={
              <Suspense fallback={<LoadingIndicator />}>
                <RemoveBackground />
              </Suspense>
            }
          />
          <Route
            path="cleanup"
            element={
              <Suspense fallback={<LoadingIndicator />}>
                <Cleanup />
              </Suspense>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Generation;
