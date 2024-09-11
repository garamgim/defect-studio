import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

const Img2ImgDisplay = () => {
  // 슬라이스에서 생성된 이미지 URL 가져오기
  const outputImgUrls = useSelector((state: RootState) => state.img2Img.outputImgUrls);

  return (
    <div className="h-full image-display flex flex-wrap gap-4 overflow-y-auto custom-scrollbar2">
      {outputImgUrls.length > 0 ? (
        outputImgUrls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Generated image ${index}`}
            className="h-48 object-cover rounded-xl border border-gray-300 dark:border-gray-700"
          />
        ))
      ) : (
        <p>No images generated yet.</p>
      )}
    </div>
  );
};

export default Img2ImgDisplay;
