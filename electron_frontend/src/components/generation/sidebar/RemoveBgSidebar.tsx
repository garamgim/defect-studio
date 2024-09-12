import { useState } from 'react';
import UploadImage from '../params/UploadImgParams';
import { useDispatch } from 'react-redux';
import { setImages } from '../../../store/slices/generation/removeBgSlice'

const RemoveBgSidebar = () => {
  const dispatch = useDispatch()
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const imageDataUrl = reader.result as string;
        setImageSrc(imageDataUrl);  
        
        if (imageDataUrl) {
          dispatch(setImages([imageDataUrl]));
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full h-full mr-6">
      <div className="w-full h-full overflow-y-auto custom-scrollbar rounded-[15px] bg-white shadow-lg border border-gray-300 dark:bg-gray-600 dark:border-none">
        {/* 이미지 업로드 */}
        <UploadImage handleImageUpload={handleImageUpload} imagePreview={imageSrc} />
      </div>
    </div>
  );
};

export default RemoveBgSidebar;
