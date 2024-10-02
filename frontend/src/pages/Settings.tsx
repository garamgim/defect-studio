import { useState } from 'react';
import { showToastSuccess, showToastError } from '../components/common/ToastNotification';
import ToastNotification from '../components/common/ToastNotification';
import { useGetDeviceCudaAvailable, useGetDeviceHealth, useGetDeviceCudaUsage } from '@/hooks/settings/useGetStatus';
import { queryClient } from '@/main';
import CudaUsageTable from '@/components/settings/CudaUsageTable';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setGpuNum } from '@/store/slices/settings/settingsSlice';

type queryKeyType = 'deviceHealth' | 'deviceCudaAvailable' | 'deviceCudaUsage';

// 데이터 갱신 요청 함수
const refreshData = async (updateQueryKey: queryKeyType) => {
  await queryClient.invalidateQueries({
    queryKey: [updateQueryKey]
  });
};

const Settings = () => {
  const dispatch = useDispatch();
  const gpuNum = useSelector((state: RootState) => state.settings.gpuNum);

  // GPU 서버 연결 상태 확인
  const {
    data: healthStatus,
    isPending: isHealthPending,
    isError: isHealthError,
    error: healthError
  } = useGetDeviceHealth();

  // CUDA 사용 가능 여부 확인
  const {
    data: cudaAvailability,
    isPending: isCudaAvailabilityPending,
    isError: isCudaAvailabilityError,
    error: cudaAvailabilityError
  } = useGetDeviceCudaAvailable();

  const {
    data: cudaUsageData,
    isPending: cudaUsagePending,
    isError: isCudaUsageError,
    error: cudaUsageError
  } = useGetDeviceCudaUsage();

  // Gpu 서버 선택 위한 react-hook-form
  type gpuServerType = {
    device_num: number;
  };

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid },
    setValue
  } = useForm<gpuServerType>({ mode: 'onChange', defaultValues: { device_num: -1 } });

  const [isRefreshEnable, setIsRefreshEnable] = useState(true);

  const onSubmit = (data) => {
    // data는 폼에 입력된 값들이 객체 형태로 전달됩니다.
    dispatch(setGpuNum(data.device_num));
  };

  const handleChange = (event) => {
    setValue('device_num', Number(event.target.value)); // 선택된 값 설정
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-60px)] bg-gray-100 p-4 overflow-hidden dark:bg-gray-800">
      <div className="w-full max-w-5xl bg-white py-10 px-12 rounded-[20px] mx-auto border border-gray-300 shadow-md h-full dark:bg-gray-600 dark:border-none overflow-y-auto custom-scrollbar ">
        <div className="flex justify-between">
          <h1 className="text-[24px] font-semibold mb-6 text-dark dark:text-white">Device Monitoring and Management</h1>
          {/* 데이터 갱신 버튼 */}
          <button
            className="h-[40px] bg-blue-500 hover:bg-blue-700 text-white font-semibold px-4 rounded-lg disabled:opacity-50"
            disabled={isHealthPending || isCudaAvailabilityPending || cudaUsagePending || !isRefreshEnable}
            onClick={async (e) => {
              e.preventDefault();
              setIsRefreshEnable(false);
              try {
                await refreshData('deviceHealth');
                await refreshData('deviceCudaAvailable');
                await refreshData('deviceCudaUsage');
                showToastSuccess(<span>Data has been successfully refreshed.</span>);
              } catch (error) {
                console.error(error);
                showToastError(<span>error?.message || 'Failed to refresh data.'</span>);
              } finally {
                setTimeout(() => {
                  setIsRefreshEnable(true);
                }, 3000); // 3초 후 버튼 활성화
              }
            }}
          >
            {isHealthPending || isCudaAvailabilityPending || cudaUsagePending ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>

        {/* 그래프 서버 상태 및 설정 */}
        <main>
          <h1 className="mb-8 text-[18px] font-bold text-gray-800 dark:text-gray-200">Gpu Server Status</h1>
          <section className="flex flex-row justify-evenly">
            <div className="mb-4 flex flex-col justify-center align-middle items-center">
              <span className="font-bold text-black dark:text-white">Health Status</span>
              <span className={`ml-3 ${isHealthError ? 'text-red-400' : 'text-dark dark:text-white'}`}>
                {isHealthPending
                  ? 'Checking health status...'
                  : healthStatus
                    ? 'Available'
                    : healthError?.message || 'Unhealthy'}
              </span>
            </div>

            <div className="mb-4 flex flex-col justify-center align-middle items-center">
              <span className="font-bold text-black dark:text-white">Cuda Status</span>
              <span className={`ml-3 ${isCudaAvailabilityError ? 'text-red-400' : 'text-dark dark:text-white'}`}>
                {isCudaAvailabilityPending
                  ? 'Checking CUDA availability...'
                  : cudaAvailability
                    ? 'Available'
                    : cudaAvailabilityError?.message || 'Unavailable'}
              </span>
            </div>
          </section>

          <hr className="my-4" />

          <section>
            {cudaUsagePending && <div>Loading...</div>}
            {isCudaUsageError && <div>Error: {cudaUsageError?.message || 'SomeThing went wrong'}</div>}
            {cudaUsageData && <CudaUsageTable data={cudaUsageData} />}
          </section>

          <div>
            <h4 className="text-[16px] mb-2 font-bold text-gray-800 dark:text-gray-200">Current Gpu Device</h4>
            <div>{gpuNum}</div>
          </div>

          {/* 사용사 서버 선택 */}
          <section>
            {cudaUsageData && (
              <div>
                <h4 className="text-[16px] mt-8 mb-2 font-bold text-gray-800 dark:text-gray-200">
                  Please select the Gpu Device you want to change
                </h4>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <select
                    {...register('device_num', {
                      required: 'Select GPU server',
                      min: {
                        value: 0,
                        message: 'Select GPU server'
                      }
                    })}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-[50px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-none"
                  >
                    <option defaultValue={-1} key={-1} value={-1} disabled>
                      Select a GPU Device
                    </option>
                    {cudaUsageData.map((item) => (
                      <option key={item['GPU num']} value={item['GPU num']}>
                        Num : {item['GPU num']} // {item['GPU name']}
                      </option>
                    ))}
                  </select>

                  <button
                    disabled={isSubmitting || !isValid}
                    type="submit"
                    className="mt-4 active:scale-95 hover:scale-105 disabled:hover:scale-100 font-bold w-[220px] h-[40px] bg-blue-500 text-white rounded-lg disabled:opacity-50 transition transform duration-150 ease-in-out"
                  >
                    Set GPU Device
                  </button>
                </form>
              </div>
            )}
          </section>
        </main>

        {/* <Form layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Default Path for Generated Images"
            name="imagePath"
            rules={[
              {
                required: false,
                message: 'Please input the path for generated images!'
              }
            ]}
          >
            <Input
              value={imagePath}
              onChange={(e) => setImagePath(e.target.value)}
              placeholder="Enter the path where generated images will be saved"
              className="rounded-lg border-gray-300"
            />
          </Form.Item>

          <Form.Item
            label="Default Path for Generated Models"
            name="modelPath"
            rules={[
              {
                required: false,
                message: 'Please input the path for generated models!'
              }
            ]}
          >
            <Input
              value={modelPath}
              onChange={(e) => setModelPath(e.target.value)}
              placeholder="Enter the path where generated models will be saved"
              className="rounded-lg border-gray-300"
            />
          </Form.Item>

          <Form.Item className="flex justify-end">
            <Button type="primary" htmlType="submit" className="w-[120px] text-[16px]">
              Save Settings
            </Button>
          </Form.Item>
        </Form> */}
      </div>
      <ToastNotification />
    </div>
  );
};

export default Settings;
