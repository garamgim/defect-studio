import axiosInstance from '../api/token/axiosInstance';

// scheduler 리스트 가져오는 함수
export const getSchedulers = async (): Promise<string[]> => {
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
export async function postTxt2ImgGeneration(
  gpu_env: string,
  data: {
    model: string;
    scheduler: string;
    prompt: string;
    negative_prompt: string;
    width: number;
    height: number;
    num_inference_steps: number;
    guidance_scale: number;
    seed: number;
    batch_count: number;
    batch_size: number;
    output_path: string;
  }
) {
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

    if (response.status === 201) {
      return response.data.image_list; // image_list 배열 반환
    } else {
      throw new Error('Failed to generate text-to-image');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to generate text-to-image');
  }
}

// image-to-image 변환 함수
export async function postImg2ImgGeneration(
  gpu_env: string,
  data: {
    model: string;
    scheduler: string;
    prompt: string;
    negative_prompt: string;
    width: number;
    height: number;
    num_inference_steps: number;
    guidance_scale: number;
    strength: number;
    seed: number;
    batch_count: number;
    batch_size: number;
    images: File[];
    input_path: string;
    output_path: string;
  }
) {
  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
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

    console.log('Response status:', response.status);
    console.log('Response data:', response.data.image_list);

    if (response.status === 201) {
      return response.data.image_list; // image_list 배열 반환
    } else {
      throw new Error('Failed to generate image-to-image');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to generate image-to-image');
  }
}

// inpainting 함수
export async function postInpaintingGeneration(
  gpu_env: string,
  data: {
    model: string;
    scheduler: string;
    prompt: string;
    negative_prompt: string;
    width: number;
    height: number;
    num_inference_steps: number;
    guidance_scale: number;
    strength: number;
    seed: number;
    batch_count: number;
    batch_size: number;
    init_image_list: File[];
    mask_image_list: File[];
    init_input_path: string;
    mask_input_path: string;
    output_path: string;
  }
) {
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

    const response = await axiosInstance.post(`generation/inpainting/${gpu_env}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('Response status:', response.status);
    console.log('Response data:', response.data.image_list);

    if (response.status === 201) {
      return response.data.image_list; // image_list 배열 반환
    } else {
      throw new Error('Failed to generate image-to-image');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to generate image-to-image');
  }
}

// clip 함수 (image -> text 변환)
export const getClip = async (imageFiles: File[]): Promise<string[]> => {
  try {
    const formData = new FormData();

    imageFiles.forEach((file) => {
      formData.append('images', file); 
    });

    const response = await axiosInstance.post('/generation/clip', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.status === 201) {
      return response.data.generated_prompts;
    } else {
      throw new Error('Failed to get generated prompts');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get generated prompts');
  }
};

// removeBackground 함수
export async function postRemoveBgGeneration(
  gpu_env: string,
  data: {
    images: File[];
    input_path: string;
    output_path: string;
  }
) {
  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      console.log(key, value)
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

    console.log('Response status:', response.status);
    console.log('Response data:', response.data.image_list);

    if (response.status === 201) {
      return response.data.image_list; // image_list 배열 반환
    } else {
      throw new Error('Failed to generate remove-background image');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to generate remove-background image');
  }
}

// cleanUp 함수
export async function postCleanupGeneration(
  gpu_env: string,
  data: {
    images: File[];
    masks: File[];
  }
) {
  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      console.log(key, value);
      console.log('test')
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

    console.log('Response status:', response.status);
    console.log('Response data:', response.data.image_list);

    if (response.status === 201) {
      return response.data.image_list; // image_list 배열 반환
    } else {
      throw new Error('Failed to generate cleanup image');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to generate cleanup image');
  }
}
