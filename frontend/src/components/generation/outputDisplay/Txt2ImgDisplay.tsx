import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

const Txt2ImgDisplay = () => {
  const { outputImgUrls, isLoading, batchCount, batchSize, width, height } = useSelector(
    (state: RootState) => state.txt2Img
  );

  // 생성할 이미지 가로세로 비율 계산
  const aspectRatio = width / height;

  return (
    <div className="h-full image-display grid gap-4 overflow-y-auto custom-scrollbar2">
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mr-[16px]">
          {Array.from({ length: batchCount * batchSize }).map((_, index) => (
            <div
              key={index}
              className="relative w-full h-0"
              style={{
                paddingBottom: `${100 / aspectRatio}%`
              }}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl border border-gray-300 dark:border-gray-700" />
            </div>
          ))}
        </div>
      ) : outputImgUrls.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mr-[16px]">
          {outputImgUrls.map((url, index) => (
            <div
              key={index}
              className="relative w-full h-0"
              style={{
                paddingBottom: `${100 / aspectRatio}%`
              }}
            >
              <img
                src={url}
                alt={`Generated image ${index}`}
                className="absolute top-0 left-0 w-full h-full object-cover rounded-xl border border-gray-300 dark:border-gray-700"
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No images generated yet.</p>
      )}
    </div>
  );
};

export default Txt2ImgDisplay;
