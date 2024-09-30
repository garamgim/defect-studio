import { useState } from 'react';
import { Input, Button, Form } from 'antd';
import { showToastSuccess, showToastError } from '../components/common/ToastNotification';
import ToastNotification from '../components/common/ToastNotification';
import { useGetDeviceCudaAvailable, useGetDeviceHealth } from '@/hooks/settings/useGetStatus';
// import { queryClient } from '@/main';
import CudaUsageTable from '@/components/settings/CudaUsageTable';

// type queryKeyType = 'deviceHealth' | 'deviceCudaAvailable' | 'deviceCudaUsage';
// const refreshData = (updateQueryKey: queryKeyType) => {
//   console.log('refreshing data', updateQueryKey);
//   queryClient.invalidateQueries({
//     queryKey: [updateQueryKey]
//   });
// };

const Settings = () => {
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
  const [imagePath, setImagePath] = useState<string>('');
  const [modelPath, setModelPath] = useState<string>('');

  // 설정 저장
  const handleSave = () => {
    if (imagePath.trim() || modelPath.trim()) {
      showToastSuccess(<span>Your paths have been successfully saved.</span>);
    } else {
      showToastError(<span>Please fill in both paths before saving.</span>);
    }
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-60px)] bg-gray-100 p-4 overflow-hidden dark:bg-gray-800">
      <div className="w-full max-w-5xl bg-white py-10 px-12 rounded-[20px] mx-auto border border-gray-300 shadow-md h-full dark:bg-gray-600 dark:border-none">
        <h1 className="text-[24px] font-semibold mb-6 text-gray-800 dark:text-gray-300">
          Device Monitoring and Management
        </h1>

        <section className="flex flex-row justify-evenly">
          <div className="mb-4 flex flex-col justify-center align-middle items-center">
            <span className="font-bold text-black dark:text-white">Server Health Status</span>
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

        {/* <div className="mb-4">
          <Button type="primary" onClick={checkCudaUsage} loading={isCudaUsageLoading}>
            CUDA Usage Monitoring
          </Button>
        </div> */}

        <hr />

        <section>
          <CudaUsageTable />
        </section>

        <section className="mt-3 flex flex-col">
          <h4 className="text-[20px] text-dark dark:text-white font-bold">GPU Server Status</h4>
        </section>

        <Form layout="vertical" onFinish={handleSave}>
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
        </Form>
      </div>
      <ToastNotification />
    </div>
  );
};

export default Settings;
