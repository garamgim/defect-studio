// ImageDisplay.tsx
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

const Txt2ImgDisplay = () => {
  // 슬라이스에서 이미지 URL 가져오기
  const imageUrls = useSelector((state: RootState) => state.txtToImg.imageUrls);

  return (
    <div className="image-display flex flex-wrap gap-4 overflow-y-auto border">
      {imageUrls.length > 0 ? (
        imageUrls.map((url, index) => (
          <img key={index} src={url} alt={`Generated image ${index}`} className="h-48 object-cover rounded-md" />
        ))
      ) : (
        <p>No images generated yet.</p>
      )}
    </div>
  );
};

export default Txt2ImgDisplay;
