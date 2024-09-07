import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Button, Modal } from 'antd';
import TextToImage from '../components/generation/layouts/TextToImage';
import ImageToImage from '../components/generation/layouts/ImageToImage';
import Inpainting from '../components/generation/layouts/Inpainting';
import RemoveBackground from '../components/generation/layouts/RemoveBackground';
import Cleanup from '../components/generation/layouts/Cleanup';
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai';
import { FaImage, FaMagic, FaPaintBrush, FaEraser, FaTrash } from 'react-icons/fa';
import PresetContent from '../components/generation/presets/PresetContent';

const Generation = () => {
  // 사이드바 열림/닫힘 상태 관리
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-[calc(100vh-60px)] bg-gray-100 dark:bg-gray-800">
      {/* 사이드 메뉴탭 선택 */}
      <div
        className={`py-8 fixed top-0 left-0 bg-white shadow-lg z-20 h-full transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-20 dark:bg-gray-800 dark:border-r dark:border-gray-600`}
        style={{ top: '60px' }}
      >
        <nav className="flex flex-col items-center">
          <button
            className="border border-gray-300 text-gray-600 rounded-md py-[4px] px-[8px] text-[14px] 
            hover:bg-gray-500 hover:text-white hover:border-transparent 
            dark:text-slate-300 dark:bg-gray-700 dark:border-none 
            dark:hover:border-slate-300 dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={showModal} // 모달 열기
          >
            Preset
          </button>
          <div className="mt-6 flex flex-col items-center space-y-8">
            <Link
              to="text-to-image"
              className="flex flex-col justify-center items-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition duration-300 px-4 w-full py-2 dark:hover:bg-gray-900"
            >
              <FaImage className="w-[20px] h-[20px] dark:text-slate-400" />
              <span className="text-[12px] mt-1 dark:text-slate-400">Txt2Img</span>
            </Link>
            <Link
              to="image-to-image"
              className="flex flex-col justify-center items-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition duration-300 px-4 w-full py-2 dark:hover:bg-gray-900"
            >
              <FaMagic className="w-[20px] h-[20px] dark:text-slate-400" />
              <span className="text-[12px] mt-1 dark:text-slate-400">Img2Img</span>
            </Link>
            <Link
              to="inpainting"
              className="flex flex-col justify-center items-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition duration-300 px-4 w-full py-2 dark:hover:bg-gray-900"
            >
              <FaPaintBrush className="w-[20px] h-[20px] dark:text-slate-400" />
              <span className="text-[12px] mt-1 dark:text-slate-400">Inpaint</span>
            </Link>
            <Link
              to="remove-background"
              className="flex flex-col justify-center items-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition duration-300 px-4 w-full py-2 dark:hover:bg-gray-900"
            >
              <FaEraser className="w-[20px] h-[20px] dark:text-slate-400" />
              <span className="text-[12px] mt-1 text-center dark:text-slate-400">Remove BG</span>
            </Link>
            <Link
              to="cleanup"
              className="flex flex-col justify-center items-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition duration-300 px-4 w-full py-2 dark:hover:bg-gray-900"
            >
              <FaTrash className="w-[20px] h-[20px] dark:text-slate-400" />
              <span className="text-[12px] mt-1 dark:text-slate-400">Cleanup</span>
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
          <Route path="text-to-image" element={<TextToImage />} />
          <Route path="image-to-image" element={<ImageToImage />} />
          <Route path="inpainting" element={<Inpainting />} />
          <Route path="remove-background" element={<RemoveBackground />} />
          <Route path="cleanup" element={<Cleanup />} />
        </Routes>
      </div>

      {/* 모달 컴포넌트 (Ant Design) */}
      <Modal
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={600}
        centered
        styles={{
          body: {
            maxHeight: '80vh',
            overflowY: 'auto' // 스크롤 활성화
          }
        }}
      >
        <PresetContent />
        <div className="flex justify-end mt-4 gap-4">
          <Button onClick={closeModal}>Cancel</Button>
          <Button type="primary">Create</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Generation;