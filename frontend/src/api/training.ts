import { TrainingDataType } from '../types/training';
import axiosInstance from './token/axiosInstance';

// training 훈련 시작 함수
export const postTraining = async (gpu_env: TrainingDataType['gpu_env'], data: TrainingDataType['data']) => {
  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      console.log(key, value, typeof value);
      if (Array.isArray(value)) {
        value.forEach((file) => {
          formData.append(key, file);
        });
      } else {
        formData.append(key, typeof value === 'number' ? String(value) : value);
      }
    });

    const response = await axiosInstance.post(`training/dreambooth/${gpu_env}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log(response, '응답');

    if (response.status === 200) {
      return response.data.task_id;
    } else {
      throw new Error('Failed to training model');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to training model');
  }
};
