import axios, { AxiosResponse } from 'axios';
import axiosInstance from '@api/token/axiosInstance';

import { DailyImageCount, ToolFrequency, ModelFrequency, TokenUsage, durationSearchProps } from '@/types/statistics';

// 일별 이미지 수 (일별 생성한 이미지 총 수)

export const getDailyImageCount = async (member_id: number): Promise<AxiosResponse<DailyImageCount[]>> => {
  try {
    const response = await axiosInstance.get<DailyImageCount[]>(`/members/${member_id}/statistics/images`);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 404:
          throw new Error('Not Found');
        case 401:
          throw new Error('Unauthorized');
        default:
          throw new Error('Unknown Error');
      }
    } else {
      throw new Error('Unknown Error');
    }
  }
};

// 도구별(Tool별) 사용 횟수 : text_to_image, image_to_image etc..
export const getToolFrequency = async (member_id: number): Promise<AxiosResponse<ToolFrequency[]>> => {
  try {
    const response = await axiosInstance.get<ToolFrequency[]>(`/members/${member_id}/statistics/tools`);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 404:
          throw new Error('Not Found');
        case 401:
          throw new Error('Unauthorized');
        default:
          throw new Error('Unknown Error');
      }
    } else {
      throw new Error('Unknown Error');
    }
  }
};

// 모델별 사용 횟수
export const getModelFrequency = async (member_id: number): Promise<AxiosResponse<ModelFrequency[]>> => {
  try {
    const response = await axiosInstance.get<ModelFrequency[]>(`/members/${member_id}/statistics/models`);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 404:
          throw new Error('Not Found');
        case 401:
          throw new Error('Unauthorized');
        default:
          throw new Error('Unknown Error');
      }
    } else {
      throw new Error('Unknown Error');
    }
  }
};

// 토큰 사용 현황
export const getTokenUsage = async (
  member_id: number,
  duration?: durationSearchProps
): Promise<AxiosResponse<TokenUsage[]>> => {
  // Querystring 반영, 허용 key 값은 durationSearchProps의 key 값들
  const queryString: { [key in keyof durationSearchProps]: string } = {};
  if (duration?.start_date) queryString.start_date = duration.start_date;
  if (duration?.end_date) queryString.end_date = duration.end_date;

  try {
    const response = await axiosInstance.get<TokenUsage[]>(`/members/${member_id}/statistics/tokens/usage`, {
      params: queryString
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 404:
          throw new Error('Not Found');
        case 401:
          throw new Error('Unauthorized');
        default:
          throw new Error('Unknown Error');
      }
    } else {
      throw new Error('Unknown Error');
    }
  }
};
