import GenerateButton from '../../common/GenerateButton';
import Sidebar from '../sidebar/CleanupSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { postCleanupGeneration } from '../../../api/generation';
import { setOutputImgUrls } from '../../../store/slices/generation/cleanupSlice';
import { convertStringToFile } from '../../../utils/convertStringToFile';
import CleanupDisplay from '../outputDisplay/CleanupDisplay';

const Cleanup = () => {
  const dispatch = useDispatch();
  const { initImageList, maskImageList } = useSelector((state: RootState) => state.cleanup);

  const handleGenerate = async () => {
    const bgfiles = initImageList.map((base64Img, index) => convertStringToFile(base64Img, `image_${index}.png`));
    const canvasfiles = maskImageList.map((base64Img, index) => convertStringToFile(base64Img, `image_${index}.png`));

    const data = {
      images: bgfiles,
      masks: canvasfiles
    };

    try {
      const outputImgUrls = await postCleanupGeneration('remote', data);
      console.log('Cleanup image URLs:', outputImgUrls);
      dispatch(setOutputImgUrls(outputImgUrls));
    } catch (error) {
      console.error('Error cleaning up image:', error);
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
        <GenerateButton onClick={handleGenerate} />
      </div>
    </div>
  );
};

export default Cleanup;
