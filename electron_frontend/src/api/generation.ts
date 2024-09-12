import axiosInstance from '../api/token/axiosInstance';

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


// Clip 함수(image -> text)
