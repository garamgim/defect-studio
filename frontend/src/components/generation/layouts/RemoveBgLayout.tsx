import Sidebar from '../sidebar/RemoveBgSidebar';
import GenerateButton from '../common/GenerateButton';
import { postRemoveBgGeneration, getTaskStatus } from '../../../api/generation';
import { convertStringToFile } from '../../../utils/convertStringToFile';
import RemoveBgDisplay from '../outputDisplay/RemoveBgDisplay';
import { useRemoveBgParams } from '../../../hooks/generation/params/useRemoveBgParams';
import { RootState } from '../../../store/store';
import { useSelector, useDispatch } from 'react-redux';
import {
  setIsLoading,
  setTaskId,
  setOutputImgsCnt,
  setOutputImgsUrl,
  setAllOutputsInfo,
  setIsCheckedOutput
} from '../../../store/slices/generation/outputSlice';
import { useEffect } from 'react';
import { message } from 'antd';
import OutputToolbar from '../outputTool/OutputToolbar';

const RemoveBackground = () => {
  const dispatch = useDispatch();
  const { params, gpuNum } = useSelector((state: RootState) => state.removeBg);
  const { isLoading, taskId, output, allOutputs, isSidebarVisible } = useSelector(
    (state: RootState) => state.generatedOutput.removeBg
  );
  useRemoveBgParams();

  let files;

  const handleGenerate = async () => {
    if (params.uploadImgParams.mode === 'manual') {
      files = params.uploadImgParams.imageList.map((base64Img, index) =>
        convertStringToFile(base64Img, `image_${index}.png`)
      );
      dispatch(setOutputImgsCnt({ tab: 'removeBg', value: 1 }));
    } else {
      const fileDataArray = await window.electron.getFilesInFolder(params.uploadImgParams.inputPath);

      dispatch(
        setOutputImgsCnt({
          tab: 'img2Img',
          value: fileDataArray.length
        })
      );

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

    let gpuNumber: number;
    if (gpuNum) {
      gpuNumber = gpuNum;
    } else {
      gpuNumber = 1; // settings 기본값 가져오기
    }

    const data = {
      gpu_device: gpuNumber,
      image_list: files,
      input_path: params.uploadImgParams.inputPath,
      output_path: '' // 추후 settings 페이지 경로 넣을 예정
    };

    try {
      dispatch(setIsLoading({ tab: 'removeBg', value: true }));
      const newTaskId = await postRemoveBgGeneration('remote', data);

      dispatch(setTaskId({ tab: 'removeBg', value: newTaskId }));
    } catch (error) {
      message.error(`Error generating image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      dispatch(setIsLoading({ tab: 'removeBg', value: false }));
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
            dispatch(setOutputImgsUrl({ tab: 'removeBg', value: response.result_data }));

            window.electron
              .saveImgsWithZip(
                response.result_data,
                params.uploadImgParams.outputPath,
                'png', // 파일 형식 (png로 고정)
                params.uploadImgParams.isZipDownload
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
            dispatch(setAllOutputsInfo({ tab: 'removeBg', outputsCnt, outputsInfo }));

            dispatch(setIsLoading({ tab: 'removeBg', value: false }));
            dispatch(setIsCheckedOutput({ tab: 'removeBg', value: false }));
            dispatch(setTaskId({ tab: 'removeBg', value: null }));
          } else if (response.detail.task_status === 'FAILURE') {
            clearInterval(intervalId);
            dispatch(setIsLoading({ tab: 'removeBg', value: false }));
            dispatch(setTaskId({ tab: 'removeBg', value: null }));
            console.error('Image generation failed:', response.detail.result_data || 'Unknown error');
            alert(`Image generation failed: ${response.detail.result_data || 'Unknown error'}`);
          }
        } catch (error) {
          console.error('Failed to get task status:', error);
          dispatch(setIsLoading({ tab: 'removeBg', value: false }));
          clearInterval(intervalId);
        }
      }
    };

    if (taskId) {
      fetchTaskStatus();
      intervalId = setInterval(fetchTaskStatus, 1000); // 1초마다 상태 확인
    }

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 정리
  }, [isLoading, dispatch, taskId, allOutputs.outputsCnt, allOutputs.outputsInfo, output.imgsCnt]);

  return (
    <div className="flex h-full pt-4 pb-6">
      {/* 사이드바 */}
      {isSidebarVisible && (
        <div className="w-[360px] pl-8 h-full hidden md:block">
          <Sidebar />
        </div>
      )}

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col px-8 w-full h-full">
        <div className="flex-1 overflow-y-auto custom-scrollbar py-4 pl-4 flex">
          {/* 이미지 디스플레이 */}
          <div className="flex-1">
            <RemoveBgDisplay />
          </div>
          <OutputToolbar type="removeBg" />
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

export default RemoveBackground;
