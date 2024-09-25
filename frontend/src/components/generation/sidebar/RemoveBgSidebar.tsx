import UploadImage from '../params/UploadImgParams';
import { useRemoveBgParams } from '../../../hooks/generation/useRemoveBgParams';

const RemoveBgSidebar = () => {
  const { inputPath, outputPath, imageList, updateInputPath, updateOutputPath, updateImageList, updateMode } =
    useRemoveBgParams();

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const img = new Image();
      img.onload = () => {
        updateImageList([base64String]);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full h-full mr-6">
      <div className="w-full h-[calc(100%-80px)] overflow-y-auto custom-scrollbar rounded-[15px] bg-white shadow-lg border border-gray-300 dark:bg-gray-600 dark:border-none">
        {/* 이미지 업로드 */}
        <UploadImage
          handleImageUpload={handleImageUpload}
          imagePreview={imageList[0]}
          inputPath={inputPath}
          outputPath={outputPath}
          updateInputPath={updateInputPath}
          updateOutputPath={updateOutputPath}
          updateMode={updateMode}
        />
      </div>
    </div>
  );
};

export default RemoveBgSidebar;
