import GenerateButton from '../common/GenerateButton';
import Sidebar from '../sidebar/CleanupSidebar';
import { postCleanupGeneration } from '../../../api/generation';
import { convertStringToFile } from '../../../utils/convertStringToFile';
import CleanupDisplay from '../outputDisplay/CleanupDisplay';
import { setIsLoading, setTaskId, setOutputImgsCnt } from '../../../store/slices/generation/outputSlice';
import { RootState } from '../../../store/store';
import { useSelector, useDispatch } from 'react-redux';
import { useCleanupOutputs } from '../../../hooks/generation/outputs/useCleanupOutputs';
import OutputToolbar from '../outputTool/OutputToolbar';
import { message } from 'antd';

const Cleanup = () => {
  const dispatch = useDispatch();
  const { params, gpuNum } = useSelector((state: RootState) => state.cleanup);
  const newGpuNum = useSelector((state: RootState) => state.settings.gpuNum);
  const { isLoading, isSidebarVisible } = useCleanupOutputs();

  const convertBase64ToFileArray = (base64Array: string[], fileType: string) => {
    return base64Array.map((base64Img, index) => convertStringToFile(base64Img, `${fileType}_${index}.png`));
  };

  const handleGenerate = async () => {
    let bgFiles: File[], canvasFiles: File[];

    if (params.uploadImgWithMaskingParams.mode === 'manual') {
      bgFiles = convertBase64ToFileArray(params.uploadImgWithMaskingParams.initImageList, 'image');
      canvasFiles = convertBase64ToFileArray(params.uploadImgWithMaskingParams.maskImageList, 'mask');
      dispatch(setOutputImgsCnt({ tab: 'cleanup', value: 1 }));
    } else {
      const bgFileDataArray = await window.electron.getFilesInFolder(params.uploadImgWithMaskingParams.initInputPath);
      const maskFileDataArray = await window.electron.getFilesInFolder(params.uploadImgWithMaskingParams.maskInputPath);

      bgFiles = bgFileDataArray.map(({ data, name }) => convertStringToFile(data, name));
      canvasFiles = maskFileDataArray.map(({ data, name }) => convertStringToFile(data, name));

      dispatch(
        setOutputImgsCnt({
          tab: 'cleanup',
          value: bgFileDataArray.length
        })
      );
    }

    const gpuNumber = gpuNum || newGpuNum;

    const data = {
      gpu_device: gpuNumber,
      init_image_list: bgFiles,
      mask_image_list: canvasFiles
    };

    try {
      dispatch(setIsLoading({ tab: 'cleanup', value: true }));
      const newTaskId = await postCleanupGeneration('remote', data);

      dispatch(setTaskId({ tab: 'cleanup', value: newTaskId }));
    } catch (error) {
      message.error(`Error generating image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      dispatch(setIsLoading({ tab: 'cleanup', value: false }));
    }
  };

  return (
    <div className="flex h-full pt-4 pb-6">
      {/* 사이드바 */}
      {isSidebarVisible && (
        <div className="w-[360px] pl-8 h-full hidden md:block">
          <Sidebar />
        </div>
      )}

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col justify-end px-8 w-full h-full">
        <div className="flex-1 overflow-y-auto custom-scrollbar py-4 pl-4 flex">
          {/* 이미지 디스플레이 */}
          <div className="flex-1">
            <CleanupDisplay />
          </div>
          <OutputToolbar type="cleanup" />
        </div>
      </div>

      {/* Generate 버튼 */}
      {isSidebarVisible && (
        <div className="fixed bottom-[50px] right-[56px]">
          <GenerateButton onClick={handleGenerate} disabled={isLoading} />
        </div>
      )}
    </div>
  );
};

export default Cleanup;
