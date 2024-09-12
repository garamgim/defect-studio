import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

const Img2ImgDisplay = () => {
  // 슬라이스에서 생성된 이미지 URL 가져오기
  const outputImgUrls = useSelector((state: RootState) => state.img2Img.outputImgUrls);

  return (
    <div className="h-full image-display grid gap-4 overflow-y-auto custom-scrollbar2">
      {outputImgUrls.length > 0 ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mr-[16px]"
        >
          {outputImgUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Generated image ${index}`}
              className="w-full h-auto object-cover rounded-xl border border-gray-300 dark:border-gray-700"
            />
          ))}
        </div>
      ) : (
        <p>No images generated yet.</p>
      )}
    </div>
  );
};

export default Img2ImgDisplay;
