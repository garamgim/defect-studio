import Sidebar from '../sidebar/RemoveBgSidebar';
import GenerateButton from '../common/GenerateButton';
import { postRemoveBgGeneration } from '../../../api/generation';
import { convertStringToFile } from '../../../utils/convertStringToFile';
import RemoveBgDisplay from '../outputDisplay/RemoveBgDisplay';
import { useRemoveBgParams } from '../../../hooks/generation/params/useRemoveBgParams';
import { RootState } from '../../../store/store';
import { useSelector, useDispatch } from 'react-redux';
import { setIsLoading, setTaskId, setOutputImgsCnt } from '../../../store/slices/generation/outputSlice';

const RemoveBackground = () => {
  const dispatch = useDispatch();
  const { params, getNum } = useSelector((state: RootState) => state.removeBg);
  const { isLoading } = useSelector((state: RootState) => state.generatedOutput.removeBg);
  useRemoveBgParams();

  let files;

  const handleGenerate = async () => {
    if (params.uploadImgParams.mode === 'manual') {
      files = params.uploadImgParams.imageList.map((base64Img, index) =>
        convertStringToFile(base64Img, `image_${index}.png`)
      );
    } else {
      const fileDataArray = await window.electron.getFilesInFolder(params.uploadImgParams.inputPath);

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
      image_list: files,
      input_path: params.uploadImgParams.inputPath,
      output_path: '' // 추후 settings 페이지 경로 넣을 예정
    };

    try {
      setIsLoading({ tab: 'removeBg', value: true });
      const outputImgUrls = await postRemoveBgGeneration('remote', data);
      setOutputImgs({ tab: 'removeBg', value: keyoutputImgUrls });
    } catch (error) {
      console.error('Error removing background:', error);
    } finally {
      dispatch(setIsLoading({ tab: 'removeBg', value: false }));
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
        <RemoveBgDisplay />
      </div>

      {/* Generate 버튼 */}
      <div className="fixed bottom-[50px] right-[56px]">
        <GenerateButton onClick={handleGenerate} disabled={isLoading} />
      </div>
    </div>
  );
};

export default RemoveBackground;
