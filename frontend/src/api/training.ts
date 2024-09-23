import { TrainingDataType } from '../types/training';
import axiosInstance from './token/axiosInstance';

// training 훈련 시작 함수
export const postTraining = async (gpu_env: TrainingDataType['gpu_env'], data: TrainingDataType['data']) => {
  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      console.log(key, value);
      if (Array.isArray(value)) {
        value.forEach((file) => {
          formData.append(key, file);
        });
      } else {
        formData.append(key, typeof value === 'number' ? String(value) : value);
      }
    });

    const response = await axiosInstance.post(`generation/img-to-img/${gpu_env}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.status === 201) {
      return response.data.image_list; // image_list 배열 반환
    } else {
      throw new Error('Failed to generate image-to-image');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to generate image-to-image');
  }
};
