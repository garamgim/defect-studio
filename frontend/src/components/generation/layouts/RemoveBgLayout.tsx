import Sidebar from '../sidebar/RemoveBgSidebar';
import GenerateButton from '../../common/GenerateButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { postRemoveBgGeneration } from '../../../api/generation';
import { setOutputImgUrls } from '../../../store/slices/generation/removeBgSlice';
import { convertStringToFile } from '../../../utils/convertStringToFile';
import RemoveBgDisplay from '../outputDisplay/RemoveBgDisplay';

const RemoveBackground = () => {
  const dispatch = useDispatch();
  const { images, inputPath, outputPath } = useSelector((state: RootState) => state.removeBg);

  const handleGenerate = async () => {
    const files = images.map((base64Img, index) => convertStringToFile(base64Img, `image_${index}.png`));

    const data = {
      images: files,
      input_path: inputPath,
      output_path: outputPath
    };

    try {
      const outputImgUrls = await postRemoveBgGeneration('remote', data);
      console.log('Background removed image URLs:', outputImgUrls);

      dispatch(setOutputImgUrls(outputImgUrls));
    } catch (error) {
      console.error('Error removing background:', error);
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
        <GenerateButton onClick={handleGenerate} />
      </div>
    </div>
  );
};

export default RemoveBackground;
