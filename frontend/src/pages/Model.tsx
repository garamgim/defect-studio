import { message } from 'antd';
import { getModelDownload } from '../api/model';
import { useEffect } from 'react';
import { setTaskId } from '../store/slices/model/modelSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const Model = () => {
  const taskIds = useSelector((state: RootState) => state.trainingOutput.taskId);

  const handleGenerate = async () => {
    try {
      const newTaskId = await getModelDownload('metal_nut_model_1');
      console.log(newTaskId);
    } catch (error) {
      message.error(`Error generating image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    taskIds.forEach((taskId) => {
      if (taskId) {
        intervalIdsRef.current[taskId] = setInterval(async () => {
          const progressData = await fetchTrainingStatus(taskId);

          if (progressData?.resultData) {
            // 학습 중일 때 상태 업데이트
            if (progressData.status === 'STARTED' && progressData.resultData) {
              setChartDataMap((prev) => ({
                ...prev,
                [taskId]: {
                  labels: progressData.resultData.num_inference_steps,
                  datasets: [
                    {
                      label: 'Loss',
                      data: progressData.resultData.train_loss,
                      borderColor: 'rgba(255, 99, 132, 1)',
                      backgroundColor: 'rgba(255, 99, 132, 0.2)',
                      fill: true,
                      tension: 0.1
                    },
                    {
                      label: 'Learning Rate',
                      data: progressData.resultData.learning_rate,
                      borderColor: 'rgba(54, 162, 235, 1)',
                      backgroundColor: 'rgba(54, 162, 235, 0.2)',
                      fill: true,
                      tension: 0.1
                    }
                  ],
                  progress: progressData.resultData.progress[progressData.resultData.progress.length - 1] * 100
                }
              }));
            }
          } else {
            // 학습 완료 시 처리
            clearInterval(intervalIdsRef.current[taskId]); // interval 제거
            delete intervalIdsRef.current[taskId];

            // 완료된 taskId를 completedTaskIds에 추가
            setCompletedTaskIds((prev) => [taskId, ...prev]);

            // Redux에서 taskId 제거
            dispatch(removeTaskId(taskId));
          }
        }, 1000);
      }
    });

    return () => {
      // 컴포넌트가 unmount될 때 모든 interval 제거
      Object.values(intervalIdsRef.current).forEach(clearInterval);
    };
  }, [dispatch, taskIds]);

  return (
    <div className="flex justify-center items-center h-[calc(100vh-60px)] bg-gray-100 p-4 overflow-hidden dark:bg-gray-800">
      <button onClick={handleGenerate}>download</button>
    </div>
  );
};

export default Model;
