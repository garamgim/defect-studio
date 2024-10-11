import UploadImage from '../params/UploadImgParams';
import { useRemoveBgParams } from '../../../hooks/generation/params/useRemoveBgParams';

const RemoveBgSidebar = () => {
  const {
    inputPath,
    outputPath,
    imageList,
    isZipDownload,
    updateIsZipDownload,
    updateInputPath,
    updateOutputPath,
    updateImageList,
    updateMode
  } = useRemoveBgParams();

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const img = new Image();
      img.onload = () => {
        // 이미지 크기 제한 (2024x2024 이하)
        if (img.width > 2024 || img.height > 2024) {
          alert('The image is too large. Please upload an image with a size less than or equal to 2024x2024.');
          return;
        }
        updateImageList([base64String]);
      };

      img.onerror = () => {
        alert('Failed to load the image. Please try again.');
      };
      img.src = base64String;
    };
    reader.onerror = () => {
      alert('Failed to read the file. Please try again.');
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
          isZipDownload={isZipDownload}
          updateIsZipDownload={updateIsZipDownload}
        />
      </div>
    </div>
  );
};

export default RemoveBgSidebar;
