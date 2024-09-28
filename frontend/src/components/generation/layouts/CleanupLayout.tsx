import GenerateButton from '../../common/GenerateButton';
import Sidebar from '../sidebar/CleanupSidebar';
import { postCleanupGeneration } from '../../../api/generation';
import { convertStringToFile } from '../../../utils/convertStringToFile';
import CleanupDisplay from '../outputDisplay/CleanupDisplay';
import { setIsLoading } from '../../../store/slices/generation/outputSlice';
import { RootState } from '../../../store/store';
import { useSelector, useDispatch } from 'react-redux';

const Cleanup = () => {
  const dispatch = useDispatch();
  const { params } = useSelector((state: RootState) => state.cleanup);
  const { isLoading } = useSelector((state: RootState) => state.generatedOutput.cleanup);
  let bgFiles;
  let canvasFiles;

  const handleGenerate = async () => {
    if (params.uploadImgWithMaskingParams.mode === 'manual') {
      bgFiles = params.uploadImgWithMaskingParams.initImageList.map((base64Img, index) =>
        convertStringToFile(base64Img, `image_${index}.png`)
      );
      canvasFiles = params.uploadImgWithMaskingParams.maskImageList.map((base64Img, index) =>
        convertStringToFile(base64Img, `image_${index}.png`)
      );
    } else {
      const bgFileDataArray = await window.electron.getFilesInFolder(params.uploadImgWithMaskingParams.initInputPath);
      const maskFileDataArray = await window.electron.getFilesInFolder(params.uploadImgWithMaskingParams.maskInputPath);

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
      init_image_list: bgFiles,
      mask_image_list: canvasFiles
    };

    try {
      dispatch(setIsLoading(true));
      const outputImgUrls = await postCleanupGeneration('remote', data);
      dispatch(setOutputImgs(outputImgUrls));
    } catch (error) {
      console.error('Error cleaning up image:', error);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <div className="flex h-full pt-4 pb-6">
      {/* 사이드바 */}
      <div className="w-[360px] pl-8 h-full">
        <Sidebar />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col justify-end px-8 w-full h-full">
        <CleanupDisplay />
      </div>

      {/* Generate 버튼 */}
      <div className="fixed bottom-[50px] right-[56px]">
        <GenerateButton onClick={handleGenerate} disabled={isLoading} />
      </div>
    </div>
  );
};

export default Cleanup;
