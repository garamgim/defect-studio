import { TrainingDataType } from '../types/training';
import axiosInstance from './token/axiosInstance';

// training 훈련 시작 함수
export const postTraining = async (gpu_env: TrainingDataType['gpu_env'], data: TrainingDataType['data']) => {
  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      console.log(key, value);
      if (key === 'concept_list') {
        formData.append(key, JSON.stringify(value));
      } else if (Array.isArray(value)) {
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

    if (response.status === 200) {
      console.log(response.data.task_id);
      return response.data.task_id;
    } else {
      throw new Error('Failed to training model');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to training model');
  }
};

// ai 동작 진행 상황 확인
export const getTrainingStatus = async (task_id: string) => {
  try {
    const response = await axiosInstance.get(`/training/tasks/${task_id}`);
    console.log('2', response);
    if (response.status === 200) {
      console.log('2단계', task_id, response.data);
      return response.data;
    } else {
      throw new Error('Failed to get training-status');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get training-status');
  }
};
