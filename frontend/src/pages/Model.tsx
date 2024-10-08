import { message } from 'antd';
import { getModelDownload, getTaskStatus } from '../api/model';
import { useEffect, useRef } from 'react';
import { addTaskId, removeTaskId } from '../store/slices/model/modelSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';

const Model = () => {
  const dispatch = useDispatch();
  const taskIds = useSelector((state: RootState) => state.model.taskId); // Redux에서 taskIds 가져오기
  const intervalIdsRef = useRef<{ [key: string]: NodeJS.Timeout }>({}); // taskId 별 interval 추적

  const handleGenerate = async () => {
    try {
      const newTaskId = await getModelDownload('metal_nut_model_1'); // 모델 다운로드 요청
      console.log(`New Task ID: ${newTaskId}`);
      dispatch(addTaskId(newTaskId)); // 새로운 taskId Redux에 저장
      console.log('Task ID dispatched');
      console.log(taskIds, 'check');
    } catch (error) {
      message.error(`Error model download: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    console.log(taskIds, 'taskIds updated'); // taskIds가 변경될 때마다 이 로그가 출력됨

    taskIds.forEach((taskId) => {
      // 이미 interval이 설정된 taskId에 대해 중복 설정을 방지
      if (taskId && !intervalIdsRef.current[taskId]) {
        intervalIdsRef.current[taskId] = setInterval(async () => {
          try {
            const statusResponse = await getTaskStatus(taskId); // 상태 확인 API 호출
            console.log(`Task ID: ${taskId}, Status:`, statusResponse);

            if (!statusResponse) {
              // 작업이 완료되었을 때
              clearInterval(intervalIdsRef.current[taskId]); // Interval 제거
              delete intervalIdsRef.current[taskId]; // Interval 추적 객체에서 제거
              message.success(`Model download completed for Task ID: ${taskId}`);

              // Redux에서 해당 taskId 제거
              // dispatch(removeTaskId(taskId));
            } else if (statusResponse && statusResponse.return_code !== 0) {
              console.log(`Task ${taskId} still in progress.`);
            }
          } catch (error) {
            console.error(`Error fetching task status for Task ID ${taskId}:`, error);
          }
        }, 1000); // 1초마다 상태 확인
      }
    });

    // 컴포넌트 언마운트 시 모든 interval 제거
    return () => {
      Object.values(intervalIdsRef.current).forEach(clearInterval);
      intervalIdsRef.current = {}; // 초기화
    };
  }, [dispatch, taskIds]); // taskIds가 변경될 때마다 실행

  return (
    <div className="flex justify-center items-center h-[calc(100vh-60px)] bg-gray-100 p-4 overflow-hidden dark:bg-gray-800">
      <button onClick={handleGenerate} className="w-[300px] h-[100px] bg-red-500 text-white">
        Download Model
      </button>
    </div>
  );
};

export default Model;
