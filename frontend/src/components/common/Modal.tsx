import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center ">
      <div className="relative bg-white dark:bg-slate-700 rounded-lg shadow-lg p-6 w-full max-w-[575px] h-auto mx-auto">
        <button
          className="absolute top-2 right-2 dark:text-gray-200 text-gray-500 hover:text-gray-700 dark:hover:text-gray-500"
          onClick={onClose}
        >
          close
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
