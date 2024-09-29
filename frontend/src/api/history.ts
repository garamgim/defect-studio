import axiosInstance from './token/axiosInstance';

// 생성된 이미지 목록 조회 함수
export const getImgsList = async () => {
  try {
    const response = await axiosInstance.get('/generation/log');

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to get imgs-list');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get imgs-list');
  }
};
