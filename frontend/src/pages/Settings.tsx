import { useState } from 'react';
import { Input, Button, Form, message } from 'antd';
import { showToastSuccess, showToastError } from '../components/common/ToastNotification';
import ToastNotification from '../components/common/ToastNotification';
import { getDeviceHealth, getDeviceCudaAvailable, getDeviceCudaUsage } from '../api/settings';

const Settings = () => {
  const [health, setHealth] = useState<boolean>(false);
  const [isHealthLoading, setHealthIsLoading] = useState<boolean>(false);
  const [cudaAvailability, setCudaAvailability] = useState<boolean>(false);
  const [isCudaAvailabilityLoading, setCudaAvailabilityIsLoading] = useState<boolean>(false);
  const [cudaUsage, setCudaUsage] = useState<boolean>(false);
  const [isCudaUsageLoading, setIsCudaUsageLoading] = useState<boolean>(false);
  const [imagePath, setImagePath] = useState<string>('');
  const [modelPath, setModelPath] = useState<string>('');

  // Health Check
  const checkHealthStatus = async () => {
    setHealthIsLoading(true);
    try {
      await getDeviceHealth();
      setHealth(true);
    } catch (error) {
      setHealth(false);
    } finally {
      setHealthIsLoading(false);
    }
  };

  // CUDA Availability
  const checkCudaAvailability = async () => {
    if (!health) {
      message.error('Check health status first');
    } else {
      setCudaAvailabilityIsLoading(true);
      try {
        await getDeviceCudaAvailable();
        setCudaAvailability(true);
      } catch (error) {
        setCudaAvailability(false);
      } finally {
        setCudaAvailabilityIsLoading(false);
      }
    }
  };

  // CUDA Usage Monitoring
  const checkCudaUsage = async () => {
    if (!health && !cudaAvailability) {
      message.error('Check health status first');
    } else {
      setIsCudaUsageLoading(true);
      try {
        const response = await getDeviceCudaUsage();
        setCudaUsage(true);
      } catch (error) {
        setCudaUsage(false);
      } finally {
        setIsCudaUsageLoading(false);
      }
    }
  };

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

        <div className="mb-4">
          <Button type="primary" onClick={checkHealthStatus} loading={isHealthLoading}>
            Health Status Check
          </Button>
          <span className="ml-3">
            {health ? 'Connectable status to GPU server' : 'Unable to connect to GPU server'}
          </span>
        </div>

        <div className="mb-4">
          <Button type="primary" onClick={checkCudaAvailability} loading={isCudaAvailabilityLoading}>
            CUDA Availability Check
          </Button>
          <span className="ml-3">{cudaAvailability ? 'Status of gpu enabled' : 'gpu unavailable status'}</span>
        </div>

        <div className="mb-4">
          <Button type="primary" onClick={checkCudaUsage} loading={isCudaUsageLoading}>
            CUDA Usage Monitoring
          </Button>
        </div>

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
