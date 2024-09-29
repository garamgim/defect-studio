import GenerateButton from '../common/GenerateButton';
import Sidebar from '../sidebar/CleanupSidebar';
import { postCleanupGeneration, getTaskStatus } from '../../../api/generation';
import { convertStringToFile } from '../../../utils/convertStringToFile';
import CleanupDisplay from '../outputDisplay/CleanupDisplay';
import {
  setIsLoading,
  setTaskId,
  setOutputImgsUrl,
  setOutputImgsCnt,
  setAllOutputsInfo,
  setIsCheckedOutput
} from '../../../store/slices/generation/outputSlice';
import { RootState } from '../../../store/store';
import { useSelector, useDispatch } from 'react-redux';
import { useCleanupOutputs } from '@/hooks/generation/outputs/useCleanupOutputs';
import { useEffect } from 'react';
import OutputToolbar from '../outputTool/OutputToolbar';
import { message } from 'antd';

const Cleanup = () => {
  const dispatch = useDispatch();
  const { params, gpuNum } = useSelector((state: RootState) => state.cleanup);
  const { isLoading, taskId, output, allOutputs, isSidebarVisible } = useCleanupOutputs();

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

    const gpuNumber = gpuNum || 1; // GPU 번호 설정 간소화

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

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    const fetchTaskStatus = async () => {
      if (isLoading && taskId) {
        try {
          const response = await getTaskStatus(taskId);
          if (response.task_status === 'SUCCESS') {
            clearInterval(intervalId); // 성공 시 상태 확인 중지
            dispatch(setOutputImgsUrl({ tab: 'cleanup', value: response.result_data }));

            window.electron
              .saveImgsWithZip(
                response.result_data,
                params.uploadImgWithMaskingParams.outputPath,
                'png', // 파일 형식 (png로 고정)
                params.uploadImgWithMaskingParams.isZipDownload
              )
              .then((result) => {
                if (result.success) {
                  console.log('이미지가 성공적으로 저장되었습니다:', result.success);
                } else {
                  console.error('이미지 저장 중 오류 발생:', result.error);
                }
              })
              .catch((error) => {
                console.error('이미지 저장 오류:', error);
              });

            const outputsCnt = allOutputs.outputsCnt + output.imgsCnt;
            const outputsInfo = [
              {
                id: response.result_data_log.id,
                imgsUrl: response.result_data,
                prompt: response.result_data_log.prompt
              },
              ...allOutputs.outputsInfo
            ];
            dispatch(setAllOutputsInfo({ tab: 'cleanup', outputsCnt, outputsInfo }));

            dispatch(setIsLoading({ tab: 'cleanup', value: false }));
            dispatch(setIsCheckedOutput({ tab: 'cleanup', value: false }));
            dispatch(setTaskId({ tab: 'cleanup', value: null }));
          }
        } catch (error) {
          console.error('Failed to get task status:', error);
          dispatch(setIsLoading({ tab: 'cleanup', value: false }));
          clearInterval(intervalId);
        }
      }
    };

    if (taskId) {
      fetchTaskStatus();
      intervalId = setInterval(fetchTaskStatus, 1000); // 1초마다 상태 확인
    }

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 정리
  }, [
    taskId,
    isLoading,
    dispatch,
    allOutputs.outputsCnt,
    output.imgsCnt,
    allOutputs.outputsInfo,
    params.uploadImgWithMaskingParams.outputPath,
    params.uploadImgWithMaskingParams.isZipDownload
  ]);

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
