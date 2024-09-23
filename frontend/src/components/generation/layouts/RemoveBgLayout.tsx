import Sidebar from '../sidebar/RemoveBgSidebar';
import GenerateButton from '../../common/GenerateButton';
import { postRemoveBgGeneration } from '../../../api/generation';
import { convertStringToFile } from '../../../utils/convertStringToFile';
import RemoveBgDisplay from '../outputDisplay/RemoveBgDisplay';
import { useRemoveBgParams } from '../../../hooks/generation/useRemoveBgParams';

const RemoveBackground = () => {
  const { imageList, inputPath, outputPath, isLoading, mode, handleSetIsLoading, handleSetOutputImgUrls } =
    useRemoveBgParams();

  let files;

  const handleGenerate = async () => {
    if (mode === 'manual') {
      files = imageList.map((base64Img, index) => convertStringToFile(base64Img, `image_${index}.png`));
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
      image_list: files,
      input_path: inputPath,
      output_path: outputPath
    };

    try {
      handleSetIsLoading(true);
      const outputImgUrls = await postRemoveBgGeneration('remote', data);
      handleSetOutputImgUrls(outputImgUrls);
    } catch (error) {
      console.error('Error removing background:', error);
    } finally {
      handleSetIsLoading(false);
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
