import { useState } from 'react';
import UploadImage from '../params/UploadImgParams';
import { useDispatch } from 'react-redux';
import { setImages, setInputPath, setOutputPath, setMode } from '../../../store/slices/generation/removeBgSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

const RemoveBgSidebar = () => {
  const dispatch = useDispatch();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const { inputPath, outputPath } = useSelector((state: RootState) => state.removeBg);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const img = new Image();
      img.onload = () => {
        setImageSrc(base64String);
        dispatch(setImages([base64String]));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full h-full mr-6">
      <div className="w-full h-full overflow-y-auto custom-scrollbar rounded-[15px] bg-white shadow-lg border border-gray-300 dark:bg-gray-600 dark:border-none">
        {/* 이미지 업로드 */}
        <UploadImage
          handleImageUpload={handleImageUpload}
          imagePreview={imageSrc}
          inputPath={inputPath}
          outputPath={outputPath}
          setInputPath={(value: string) => {
            dispatch(setInputPath(value));
          }}
          setOutputPath={(value: string) => {
            dispatch(setOutputPath(value));
          }}
          setMode={(value: 'manual' | 'batch') => {
            dispatch(setMode(value));
          }}
        />
      </div>
    </div>
  );
};

export default RemoveBgSidebar;
