import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { setSelectedImgs } from '../../../store/slices/generation/outputSlice';
import { useCallback, useMemo } from 'react';

const Txt2ImgDisplay = () => {
  const dispatch = useDispatch();
  const { params } = useSelector((state: RootState) => state.txt2Img);
  const { output, isLoading, allOutputs, selectedImgs } = useSelector(
    (state: RootState) => state.generatedOutput.txt2Img
  );

  // 이미지 가로세로 비율 계산을 useMemo로 최적화
  const aspectRatio = useMemo(
    () => params.imgDimensionParams.width / params.imgDimensionParams.height,
    [params.imgDimensionParams.width, params.imgDimensionParams.height]
  );

  // 이미지 클릭 핸들러 useCallback으로 최적화
  const handleImageClick = useCallback(
    (url: string) => {
      const updatedImages = selectedImgs.includes(url)
        ? selectedImgs.filter((imageUrl) => imageUrl !== url) // 선택 해제
        : [...selectedImgs, url]; // 선택 추가

      dispatch(setSelectedImgs({ tab: 'txt2Img', value: updatedImages }));
    },
    [dispatch, selectedImgs]
  );

  // 이미지 렌더링 로직을 분리
  const renderImages = (imgsUrl: string[]) => {
    return imgsUrl.map((url, imgIndex) => (
      <div
        key={imgIndex}
        className="relative w-full h-0 cursor-pointer"
        onClick={() => handleImageClick(url)} // 클릭 시 해당 이미지의 URL 전달
        style={{
          paddingBottom: `100%`
        }}
      >
        <img
          src={url}
          alt={`Generated image ${imgIndex}`} // 이미지 인덱스 반영
          className={`absolute top-0 left-0 w-full h-full object-cover rounded-xl ${
            selectedImgs.includes(url) ? 'border-4 border-blue-500' : 'border border-gray-300 dark:border-gray-700'
          }`}
          style={{
            boxSizing: 'border-box' // 이미지 안쪽에 테두리 적용
          }}
        />
      </div>
    ));
  };

  return (
    <div className="h-full image-display grid gap-4 overflow-y-auto custom-scrollbar2">
      {isLoading ? (
        <div
          className="grid gap-4 mr-[16px]"
          style={{
            gridTemplateColumns:
              allOutputs.outputsCnt + output.imgsCnt <= 4
                ? 'repeat(4, 1fr)' // 이미지가 4개 이하일 때는 4열 고정
                : 'repeat(auto-fit, minmax(200px, 1fr))' // 4개 이상일 때는 부모 요소 크기에 맞춰 조정
          }}
        >
          {Array.from({ length: output.imgsCnt }).map((_, index) => (
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
      ) : allOutputs.outputsCnt > 0 ? (
        <div
          className="grid gap-4 mr-[16px]"
          style={{
            gridTemplateColumns:
              allOutputs.outputsCnt <= 4
                ? 'repeat(4, 1fr)' // 이미지가 4개 이하일 때는 4열 고정
                : 'repeat(auto-fit, minmax(200px, 1fr))' // 4개 이상일 때는 부모 요소 크기에 맞춰 조정
          }}
        >
          {allOutputs.outputsInfo.map((outputInfo) => renderImages(outputInfo.imgsUrl))}
        </div>
      ) : (
        <p>No images generated yet.</p>
      )}
    </div>
  );
};

export default Txt2ImgDisplay;
