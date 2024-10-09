import { useState, useEffect, useRef } from 'react';
import { Input, message } from 'antd';
import { getModelDownload, getTaskStatus } from '../api/model';
import { getModelList } from '../api/generation';
import { useDispatch, useSelector } from 'react-redux';
import { addTaskId, removeTaskId } from '../store/slices/model/modelSlice';
import { RootState } from '@/store/store';
import { useQuery } from '@tanstack/react-query';
import { useGetMyInfo } from '@/hooks/user/useGetMyInfo';
import Loading from '../components/common/LoadingIndicator';

const Model = () => {
  const dispatch = useDispatch();
  const taskIds = useSelector((state: RootState) => state.model.taskId);
  const intervalIdsRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const { myInfo } = useGetMyInfo({ isLoggedIn: !!localStorage.getItem('accessToken') });
  const memberId = myInfo?.member_id as number;

  const {
    data: modelList,
    isLoading,
    error
  } = useQuery<string[], Error>({
    queryKey: ['models', memberId],
    queryFn: () => getModelList(memberId)
  });

  useEffect(() => {
    if (error) {
      message.error(`Error loading the model list: ${error.message}`);
    }
  }, [error]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredModels, setFilteredModels] = useState<string[]>([]);

  const handleGenerate = async (modelName: string) => {
    try {
      const newTaskId = await getModelDownload(modelName);
      dispatch(addTaskId(newTaskId));
      message.success(`Started downloading model: ${modelName}`);
    } catch (error) {
      message.error(`Error downloading model: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    if (modelList) {
      const filtered = modelList.filter((model) => model.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredModels(filtered);
    }
  }, [modelList, searchTerm]);

  useEffect(() => {
    taskIds.forEach((taskId) => {
      if (taskId && !intervalIdsRef.current[taskId]) {
        intervalIdsRef.current[taskId] = setInterval(async () => {
          try {
            const statusResponse = await getTaskStatus(taskId);
            if (!statusResponse || statusResponse.task_status === 'PENDING') {
              clearInterval(intervalIdsRef.current[taskId]);
              delete intervalIdsRef.current[taskId];
              dispatch(removeTaskId(taskId));
            } else if (statusResponse.task_status === 'STARTED') {
              console.log('진행중');
            }
          } catch (error) {
            console.error(`Error fetching task status for Task ID ${taskId}:`, error);
          }
        }, 10000);
      }
    });

    return () => {
      Object.values(intervalIdsRef.current).forEach(clearInterval);
      intervalIdsRef.current = {};
    };
  }, [taskIds, dispatch]);

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col items-start h-[calc(100vh-60px)] bg-gray-100 p-8 overflow-auto dark:bg-gray-800">
      {/* 검색 바 */}
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search by Model Name</label>
      <Input
        placeholder="Search model"
        size="large"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-8 w-full max-w-lg"
      />

      <h1 className="text-[24px] font-semibold mb-6 text-dark dark:text-white">
        Click on the model you want to download
      </h1>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 w-full">
        {filteredModels.length > 0 ? (
          filteredModels.map((model) => (
            <div
              key={model}
              className="p-4 border border-gray-300 dark:border-none bg-white dark:bg-gray-700 rounded-lg shadow-lg flex justify-between items-center w-full hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
              style={{ minHeight: '100px' }}
              onClick={() => handleGenerate(model)}
            >
              <h2
                className="text-[16px] dark:text-gray-100 truncate"
                style={{ maxWidth: '80%', wordBreak: 'break-word' }}
                title={model}
              >
                {model}
              </h2>
            </div>
          ))
        ) : (
          <p className="text-gray-400 dark:text-gray-500">No models found.</p>
        )}
      </div>
    </div>
  );
};

export default Model;
