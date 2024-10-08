import { useEffect, useState, useRef } from 'react';
import { Progress, message, Button } from 'antd';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { getTrainingStatus } from '../../../api/training';
import { RootState } from '../../../store/store';
import { useSelector, useDispatch } from 'react-redux';
import { removeTaskId } from '../../../store/slices/training/outputSlice';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TrainingStatusTab = () => {
  const dispatch = useDispatch();
  const [chartDataMap, setChartDataMap] = useState<{ [key: string]: any }>({});
  const [visibleCharts, setVisibleCharts] = useState<{ [key: string]: boolean }>({});
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]); // 완료된 taskId를 저장하는 상태
  const taskIds = useSelector((state: RootState) => state.trainingOutput.taskId);
  const intervalIdsRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  // API를 통해 학습 상태를 가져오는 함수
  const fetchTrainingStatus = async (taskId: string) => {
    try {
      const data = await getTrainingStatus(taskId);
      return {
        taskId: taskId,
        status: data.task_status,
        resultData: data.task_status === 'STARTED' ? data.result_data : null,
        message: data.message
      };
    } catch (error) {
      message.error(`Error fetching training status for ${taskId}`);
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    taskIds.forEach((taskId) => {
      if (taskId) {
        intervalIdsRef.current[taskId] = setInterval(async () => {
          const progressData = await fetchTrainingStatus(taskId);

          if (progressData && progressData.resultData) {
            // 학습 중일 때 상태 업데이트
            if (progressData.status === 'STARTED') {
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

            if (
              progressData &&
              progressData.status === 'SUCCESS' &&
              chartDataMap[taskId] &&
              chartDataMap[taskId].datasets[0].data.length === 0
            ) {
              alert(`Model training failed: ${progressData.message || 'Unknown error'}`);
            } else {
              // 차트 데이터가 비어 있지 않은 경우에만 completedTaskIds에 추가
              setCompletedTaskIds((prev) => [taskId, ...prev]);
            }

            // Redux에서 taskId 제거
            dispatch(removeTaskId(taskId));
          }
        }, 5000);
      }
    });

    return () => {
      // 컴포넌트가 unmount될 때 모든 interval 제거
      Object.values(intervalIdsRef.current).forEach(clearInterval);
    };
  }, [chartDataMap, dispatch, taskIds]);

  const toggleChartVisibility = (taskId: string) => {
    setVisibleCharts((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId]
    }));
  };

  // 완료된 taskId를 수동으로 제거하는 함수
  const removeCompletedTask = (taskId: string) => {
    setCompletedTaskIds((prev) => prev.filter((id) => id !== taskId));
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: 'Num of Inference Steps' } },
      y: { title: { display: true, text: 'Values' } }
    }
  };

  return (
    <div className="h-full bg-white rounded-lg p-6 shadow-lg border border-gray-300 dark:bg-gray-600 dark:border-none overflow-y-auto custom-scrollbar">
      <h3 className="text-lg font-bold mb-4 dark:text-gray-300">Training Progress Overview</h3>
      <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] lg:grid-cols-[repeat(3,minmax(200px,1fr))]">
        {/* 진행 중인 학습 상태 표시 */}
        {taskIds.map((taskId) => (
          <div
            key={taskId}
            className={`p-4 border border-gray-200 rounded-lg shadow-md dark:bg-gray-700 dark:border-none transition-all duration-300 overflow-hidden`}
            style={{ minHeight: '150px', height: visibleCharts[taskId] ? 'auto' : '150px', maxHeight: '500px' }}
          >
            <p className="font-medium mb-2 dark:text-gray-300">Id: {taskId}</p>
            <Progress percent={chartDataMap[taskId]?.progress || 0} />

            {/* 학습 진행 상황 차트 */}
            {visibleCharts[taskId] && (
              <div style={{ marginTop: '20px', height: '300px', overflowY: 'auto' }}>
                {chartDataMap[taskId] ? (
                  <Line data={chartDataMap[taskId]} options={chartOptions} />
                ) : (
                  <p>Loading chart...</p>
                )}
              </div>
            )}

            {/* View Training Logs 버튼 */}
            <Button
              type="default"
              className="mt-4 w-full dark:bg-gray-600 dark:border-none dark:text-gray-400"
              onClick={() => toggleChartVisibility(taskId)}
            >
              {visibleCharts[taskId] ? 'Hide Training Logs' : 'View Training Logs'}
            </Button>
          </div>
        ))}

        {/* 완료된 학습 상태 표시 */}
        {completedTaskIds.map((taskId) => (
          <>
            <div
              key={taskId}
              className={`p-4 border border-gray-200 rounded-lg shadow-md dark:bg-gray-700 dark:border-none transition-all duration-300 overflow-hidden`}
              style={{ minHeight: '150px', height: visibleCharts[taskId] ? 'auto' : '150px', maxHeight: '500px' }}
            >
              <p className="font-medium mb-2 dark:text-gray-300">Id: {taskId} (Completed)</p>
              <Progress percent={100} /> {/* 완료된 학습은 progress 100% */}
              {/* 학습 진행 상황 차트 */}
              {visibleCharts[taskId] && (
                <div style={{ marginTop: '20px', height: '300px', overflowY: 'auto' }}>
                  {chartDataMap[taskId] ? (
                    <Line data={chartDataMap[taskId]} options={chartOptions} />
                  ) : (
                    <p>Loading chart...</p>
                  )}
                </div>
              )}
              {/* View Training Logs 버튼 */}
              <Button
                type="default"
                className="mt-4 w-full dark:bg-gray-600 dark:border-none dark:text-gray-400"
                onClick={() => toggleChartVisibility(taskId)}
              >
                {visibleCharts[taskId] ? 'Hide Training Logs' : 'View Training Logs'}
              </Button>
              {/* 삭제 버튼 */}
              {visibleCharts[taskId] && (
                <Button type="primary" danger className="mt-2 w-full" onClick={() => removeCompletedTask(taskId)}>
                  Remove Completed Task
                </Button>
              )}
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default TrainingStatusTab;
