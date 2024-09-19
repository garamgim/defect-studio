import axios, { AxiosResponse } from 'axios';
import axiosInstance from './token/axiosInstance';

type logType = 'text_to_image' | 'image_to_image' | 'inpainting' | 'remove_background' | 'clip' | 'clean_up';

// 해당 부서 내에서 의 사람의 통계

export interface getPersonTokenRequiredData {
  member_id: number;
  start_date: string;
  end_date: string;
  use_type: logType;
}

export interface PersonTokenLogType {
  create_date: string;
  log_type: string;
  use_type: string;
  quantity: number;
}

// ----------- 개인 단위 별 요청

export const getPersonTokenStatistic = async (
  data: getPersonTokenRequiredData
): Promise<AxiosResponse<PersonTokenLogType[]>> => {
  try {
    const response = await axiosInstance.get(`/members/token-logs/use`, {
      params: {
        start_date: data.start_date,
        end_date: data.end_date,
        member_id: data.member_id,
        use_type: data.use_type
      }
    });
    console.log(response.data);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Unauthorized');
      } else if (error.response?.status === 404) {
        throw new Error('Not Found');
      } else if (error.response?.status === 422) {
        throw new Error('Unprocessable Entity');
      } else {
        throw new Error('Unknown Error');
      }
    } else {
      throw new Error('Unknown Error');
    }
  }
};
