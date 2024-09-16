import GenerateButton from '../../common/GenerateButton';
import Sidebar from '../sidebar/CleanupSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { postCleanupGeneration } from '../../../api/generation';
import { setOutputImgUrls, setIsLoading } from '../../../store/slices/generation/cleanupSlice';
import { convertStringToFile } from '../../../utils/convertStringToFile';
import CleanupDisplay from '../outputDisplay/CleanupDisplay';

const Cleanup = () => {
  const dispatch = useDispatch();
  const { initImageList, maskImageList, mode, initInputPath, maskInputPath, isLoading } = useSelector(
    (state: RootState) => state.cleanup
  );

  let bgFiles;
  let canvasFiles;

  const handleGenerate = async () => {
    if (mode === 'manual') {
      bgFiles = initImageList.map((base64Img, index) => convertStringToFile(base64Img, `image_${index}.png`));
      canvasFiles = maskImageList.map((base64Img, index) => convertStringToFile(base64Img, `image_${index}.png`));
    } else {
      const bgFileDataArray = await window.electron.getFilesInFolder(initInputPath);
      const maskFileDataArray = await window.electron.getFilesInFolder(maskInputPath);

      // base64 데이터를 Blob으로 변환하고 File 객체로 생성
      bgFiles = bgFileDataArray.map((fileData) => {
        const byteString = atob(fileData.data);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uintArray = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
          uintArray[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([arrayBuffer], { type: fileData.type });
        return new File([blob], fileData.name, { type: fileData.type });
      });

      canvasFiles = maskFileDataArray.map((fileData) => {
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
      images: bgFiles,
      masks: canvasFiles
    };

    try {
      dispatch(setIsLoading(true));
      const outputImgUrls = await postCleanupGeneration('remote', data);
      dispatch(setOutputImgUrls(outputImgUrls));
    } catch (error) {
      console.error('Error cleaning up image:', error);
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
        <CleanupDisplay />
      </div>

      {/* Generate 버튼 */}
      <div className="fixed bottom-[60px] ml-[180px]">
        <GenerateButton onClick={handleGenerate} disabled={isLoading} />
      </div>
    </div>
  );
};

export default Cleanup;
