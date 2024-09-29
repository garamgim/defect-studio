import { useDispatch } from 'react-redux';
import { setSelectedImgs } from '../../../store/slices/generation/outputSlice';
import { useImg2ImgOutputs } from '../../../hooks/generation/outputs/useImg2ImgOutputs';

const Img2ImgDisplay = () => {
  const dispatch = useDispatch();
  const { output, isLoading, allOutputs, selectedImgs } = useImg2ImgOutputs();
  const handleImageClick = (url: string) => {
    console.log('이미지수 체크: ', output.imgsCnt);
    const updatedImages = selectedImgs.includes(url)
      ? selectedImgs.filter((imageUrl: string) => imageUrl !== url)
      : [...selectedImgs, url];

    dispatch(setSelectedImgs({ tab: 'img2Img', value: updatedImages }));
  };

  return (
    <div className="h-full image-display grid gap-4 overflow-y-auto custom-scrollbar2">
      {isLoading ? (
        <div
          className="grid gap-4 mr-[16px]"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))'
          }}
        >
          {Array.from({ length: output.imgsCnt }).map((_, index) => (
            <div
              key={index}
              className="relative w-full h-0"
              style={{
                paddingBottom: '100%'
              }}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl border border-gray-300 dark:border-gray-700" />
            </div>
          ))}
          {allOutputs.outputsInfo.map((outputInfo) =>
            outputInfo.imgsUrl.map((url, imgIndex) => (
              <div
                key={imgIndex}
                className="relative w-full h-0 cursor-pointer"
                onClick={() => handleImageClick(url)}
                style={{
                  paddingBottom: '100%'
                }}
              >
                <img
                  src={url}
                  alt={`Generated image ${imgIndex}`}
                  className={`absolute top-0 left-0 w-full h-full object-cover rounded-xl ${
                    selectedImgs.includes(url)
                      ? 'border-4 border-blue-500'
                      : 'border border-gray-300 dark:border-gray-700'
                  }`}
                  style={{
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            ))
          )}
        </div>
      ) : allOutputs.outputsCnt > 0 ? (
        <div
          className="grid gap-4 mr-[16px]"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))'
          }}
        >
          {allOutputs.outputsInfo.map((outputInfo) =>
            outputInfo.imgsUrl.map((url, imgIndex) => (
              <div
                key={imgIndex}
                className="relative w-full h-0 cursor-pointer"
                onClick={() => handleImageClick(url)}
                style={{
                  paddingBottom: '100%'
                }}
              >
                <img
                  src={url}
                  alt={`Generated image ${imgIndex}`}
                  className={`absolute top-0 left-0 w-full h-full object-cover rounded-xl ${
                    selectedImgs.includes(url)
                      ? 'border-4 border-blue-500'
                      : 'border border-gray-300 dark:border-gray-700'
                  }`}
                  style={{
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            ))
          )}
        </div>
      ) : (
        <p>No images generated yet.</p>
      )}
    </div>
  );
};

export default Img2ImgDisplay;
