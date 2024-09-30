import { AxiosResponse } from 'axios';
import { GpuInfoType, gpuInfoResponse } from '@/types/settings';
import axiosInstance from './token/axiosInstance';

// health 체크
export const getDeviceHealth = async (): Promise<string> => {
  try {
    const response = await axiosInstance.get('/device/health', {
      timeout: 10000 // 10초 타임아웃
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Unable to connect to gpu server.');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get device-health');
  }
};

// cuda-available 체크
export const getDeviceCudaAvailable = async () => {
  try {
    const response = await axiosInstance.get<AxiosResponse<string>>('/device/cuda_available');

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('The gpu is unavailable.');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get cuda-available');
  }
};

export const getDeviceCudaUsage = async (): Promise<GpuInfoType[]> => {
  try {
    const response = await axiosInstance.get<gpuInfoResponse>('/device/cuda_usage');

    if (response.status === 200) {
      return response.data.data.gpu_info;
    } else {
      throw new Error('Falied to get cuda-usage');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Falied to get cuda-usage');
  }
};

// set-device 체크
export const postSetDevice = async (deviceNum: number) => {
  try {
    const response = await axiosInstance.post('/device/set_device', deviceNum);

    if (response.status === 200) {
      return response.data;
    } else if (response.status === 400) {
      return 'gpu device not found.';
    } else {
      throw new Error('The gpu is unavailable.');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get cuda-available');
  }
};
