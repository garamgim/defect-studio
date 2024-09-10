import axiosInstance from '../api/token/axiosInstance';

// text-to-image 변환 함수
export async function postTxtToImgGeneration(
  gpu_env: string,
  data: {
    model: string;
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
    // FormData 생성
    const formData = new FormData();

    // 객체의 키와 값을 순회하여 FormData에 추가
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, typeof value === 'number' ? String(value) : value);
    });

    // POST 요청 전송
    const response = await axiosInstance.post(`generation/txt-to-img/${gpu_env}`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    // 응답 데이터 출력
    console.log('Response status:', response.status);
    console.log('Response data:', response.data.image_list);

    // 응답 데이터가 배열이라면 image_list 배열을 반환
    if (response.status === 201 && Array.isArray(response.data.image_list)) {
      return response.data.image_list; // image_list 배열을 반환
    } else {
      throw new Error('Failed to generate text-to-img');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to generate text-to-img');
  }
}


// image-to-image 변환 함수
export async function postImgToImgGeneration(
  gpu_env: string,
  data: {
    model: string;
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
    // FormData 생성
    const formData = new FormData();

    // 객체의 키와 값을 순회하여 FormData에 추가
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, typeof value === 'number' ? String(value) : value);
    });

    // POST 요청 전송
    const response = await axiosInstance.post(`generation/img-to-img/${gpu_env}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // 응답 데이터 출력
    console.log('Response status:', response.status);
    console.log('Response data:', response.data.image_list);

    // 응답 데이터가 배열이라면 image_list 배열을 반환
    if (response.status === 201 && Array.isArray(response.data.image_list)) {
      return response.data.image_list; // image_list 배열을 반환
    } else {
      throw new Error('Failed to generate text-to-img');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to generate text-to-img');
  }
}

