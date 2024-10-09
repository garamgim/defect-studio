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
import { useEffect } from 'react';

const Cleanup = () => {
  const dispatch = useDispatch();
  const { params, gpuNum } = useSelector((state: RootState) => state.cleanup);
  const newGpuNum = useSelector((state: RootState) => state.settings.gpuNum);
  const { isLoading, isSidebarVisible } = useCleanupOutputs();

  // Ctrl + Enter 키를 감지하여 handleGenerate 실행
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'Enter') {
        handleGenerate();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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

      // base64 데이터를 Blob으로 변환하고 File 객체로 생성 (배경 이미지 파일)
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

      // base64 데이터를 Blob으로 변환하고 File 객체로 생성 (마스크 이미지 파일)
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

      dispatch(
        setOutputImgsCnt({
          tab: 'removeBg',
          value: bgFileDataArray.length
        })
      );
    }

    const gpuNumber = gpuNum || newGpuNum;

    const data = {
      gpu_device: gpuNumber,
      init_image_list: bgFiles,
      mask_image_list: canvasFiles,
      init_input_path: params.uploadImgWithMaskingParams.initInputPath,
      mask_input_path: params.uploadImgWithMaskingParams.maskInputPath,
      output_path: '' // 추후 설정
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
