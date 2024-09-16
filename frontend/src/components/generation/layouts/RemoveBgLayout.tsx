import Sidebar from '../sidebar/RemoveBgSidebar';
import GenerateButton from '../../common/GenerateButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { postRemoveBgGeneration } from '../../../api/generation';
import { setOutputImgUrls, setIsLoading } from '../../../store/slices/generation/removeBgSlice';
import { convertStringToFile } from '../../../utils/convertStringToFile';
import RemoveBgDisplay from '../outputDisplay/RemoveBgDisplay';

const RemoveBackground = () => {
  const dispatch = useDispatch();
  const { images, inputPath, outputPath, isLoading, mode } = useSelector((state: RootState) => state.removeBg);

  let files;

  const handleGenerate = async () => {
    if (mode === 'manual') {
      files = images.map((base64Img, index) => convertStringToFile(base64Img, `image_${index}.png`));
    } else {
      const fileDataArray = await window.electron.getFilesInFolder(inputPath);

      // base64 데이터를 Blob으로 변환하고 File 객체로 생성
      files = fileDataArray.map((fileData) => {
        const byteString = atob(fileData.data);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uintArray = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
          uintArray[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([arrayBuffer], { type: fileData.type });
        return new File([blob], fileData.name, { type: fileData.type });
      });
    }

    const data = {
      images: files,
      input_path: inputPath,
      output_path: outputPath
    };

    try {
      dispatch(setIsLoading(true));
      const outputImgUrls = await postRemoveBgGeneration('remote', data);
      dispatch(setOutputImgUrls(outputImgUrls));
    } catch (error) {
      console.error('Error removing background:', error);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <div className="flex h-[calc(100vh-60px)] pt-4 pb-6">
      {/* 사이드바 */}
      <div className="w-[360px] pl-8 pr-4 h-full">
        <Sidebar />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col justify-end px-8 w-full h-full">
        <RemoveBgDisplay />
      </div>

      {/* Generate 버튼 */}
      <div className="fixed bottom-[60px] ml-[180px]">
        <GenerateButton onClick={handleGenerate} disabled={isLoading} />
      </div>
    </div>
  );
};

export default RemoveBackground;
