import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

const InpaintingDisplay = () => {
  // 슬라이스에서 생성된 이미지 URL 가져오기
  const outputImgUrls = useSelector((state: RootState) => state.inpainting.outputImgUrls);

  return (
    <div className="h-full image-display flex flex-wrap gap-4 overflow-y-auto">
      {outputImgUrls.length > 0 ? (
        outputImgUrls.map((url, index) => (
          <img key={index} src={url} alt={`Generated image ${index}`} className="h-48 object-cover rounded-md" />
        ))
      ) : (
        <p>No images generated yet.</p>
      )}
    </div>
  );
};

export default InpaintingDisplay;
