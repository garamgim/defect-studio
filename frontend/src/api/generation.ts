import axiosInstance from '../api/token/axiosInstance';
import {
  Txt2ImgDataType,
  Img2ImgDataType,
  InpaintingDataType,
  RemoveBgDataType,
  CleanupDataType,
  PresetDataType,
  ClipDataType
} from '../types/generation';

// scheduler 리스트 가져오는 함수
export const getSchedulers = async () => {
  try {
    const response = await axiosInstance.get('/generation/schedulers');

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to get scheduler-list');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get scheduler-list');
  }
};

// text-to-image 변환 함수
export const postTxt2ImgGeneration = async (gpu_env: Txt2ImgDataType['gpu_env'], data: Txt2ImgDataType['data']) => {
  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, typeof value === 'number' ? String(value) : value);
    });

    const response = await axiosInstance.post(`generation/txt-to-img/${gpu_env}`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (response.status === 200) {
      return response.data.task_id;
    } else {
      throw new Error('Failed to generate text-to-image');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to generate text-to-image');
  }
};

// image-to-image 변환 함수
export const postImg2ImgGeneration = async (gpu_env: Img2ImgDataType['gpu_env'], data: Img2ImgDataType['data']) => {
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

    if (response.status === 200) {
      return response.data.task_id;
    } else {
      throw new Error('Failed to generate image-to-image');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to generate image-to-image');
  }
};

// inpainting 함수
export const postInpaintingGeneration = async (
  gpu_env: InpaintingDataType['gpu_env'],
  data: InpaintingDataType['data']
) => {
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

    const response = await axiosInstance.post(`generation/inpainting/${gpu_env}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.status === 200) {
      return response.data.task_id;
    } else {
      throw new Error('Failed to generate image-to-image');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to generate image-to-image');
  }
};

// clip 함수 (image -> text 변환)
export const getClip = async (data: ClipDataType) => {
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

    const response = await axiosInstance.post('/generation/clip', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.status === 200) {
      return response.data.task_id;
    } else {
      throw new Error('Failed to get generated prompts');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get generated prompts');
  }
};

// removeBackground 함수
export const postRemoveBgGeneration = async (gpu_env: RemoveBgDataType['gpu_env'], data: RemoveBgDataType['data']) => {
  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      console.log(key, value);
      if (Array.isArray(value)) {
        value.forEach((file) => {
          formData.append(key, file);
        });
      } else {
        formData.append(key, value);
      }
    });

    const response = await axiosInstance.post(`generation/remove-bg/${gpu_env}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.status === 200) {
      return response.data.task_id;
    } else {
      throw new Error('Failed to generate remove-background image');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to generate remove-background image');
  }
};

// cleanUp 함수
export const postCleanupGeneration = async (gpu_env: CleanupDataType['gpu_env'], data: CleanupDataType['data']) => {
  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((file) => {
          formData.append(key, file);
        });
      }
    });

    const response = await axiosInstance.post(`generation/cleanup/${gpu_env}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.status === 200) {
      return response.data.task_id;
    } else {
      throw new Error('Failed to generate cleanup image');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to generate cleanup image');
  }
};

// 프리셋 생성 함수
export const postPreset = async (preset: PresetDataType) => {
  console.log(preset);
  try {
    const response = await axiosInstance.post('/generation/presets', preset);

    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error('Failed to post preset');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to post preset');
  }
};

// 프리셋 목록 조회 함수
export const getPresetList = async () => {
  try {
    const response = await axiosInstance.get('/generation/presets');

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to get preset-list');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get preset-list');
  }
};

// 프리셋 세부 조회 함수
export const getPresetDetail = async (preset_id: string) => {
  try {
    const response = await axiosInstance.get(`/generation/presets/${preset_id}`);

    if (response.status === 200) {
      console.log('preset: ', response.data);
      return response.data;
    } else {
      throw new Error('Failed to get preset-detail');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get preset-detail');
  }
};

// 프리셋 삭제 함수
export const deletePreset = async (preset_id: string) => {
  try {
    const response = await axiosInstance.delete(`/generation/presets/${preset_id}`);

    if (response.status === 204) {
      return response.data;
    } else {
      throw new Error('Failed to delete preset');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete preset');
  }
};

// 모델 리스트 가져오는 함수
export const getModelList = async (member_id: number) => {
  try {
    const response = await axiosInstance.get(`/model/${member_id}`);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to get model-list');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get model-list');
  }
};

// ai 동작 진행 상황 확인
export const getTaskStatus = async (task_id: string) => {
  try {
    const response = await axiosInstance.get(`/generation/tasks/${task_id}`);

    if (response.status === 200) {
      console.log('respone.data', response.data);
      return response.data;
    } else {
      throw new Error('Failed to get task-status');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get task-status');
  }
};
