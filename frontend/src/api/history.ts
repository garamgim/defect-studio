import axiosInstance from './token/axiosInstance';

// 생성된 이미지 목록 조회 함수
export const getImgsList = async () => {
  try {
    const response = await axiosInstance.get('/generation/log');

    if (response.status === 200) {
      console.log(response.data);
      return response.data;
    } else {
      throw new Error('Failed to get imgs-list');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get imgs-list');
  }
};

// 생성된 이미지 세부 조회 함수
export const getImgsDetail = async (logId: string) => {
  try {
    const response = await axiosInstance.get(`/generation/log/${logId}`);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to get imgs-detail');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get imgs-detail');
  }
};

// 생성된 이미지 삭제 함수
export const deleteImgsFolder = async (logId: string) => {
  try {
    const response = await axiosInstance.delete(`/generation/log/${logId}`);

    if (response.status === 204) {
      return response.data;
    } else {
      throw new Error('Failed to delete imgs');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete imgs');
  }
};
