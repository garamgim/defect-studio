import { AxiosResponse } from 'axios';
import axiosInstance from './token/axiosInstance';

type UseType = 'text_to_image' | 'image_to_image' | 'inpainter' | 'remove_background' | 'clip' | 'clean_up';

// 해당 부서 내에서 의 사람의 통계

interface getPersonTokenRequiredData {
  member_id: number;
  start_date: string;
  end_date: string;
  use_type: UseType;
}

interface PersonTokenLogType {
  create_date: string;
  log_type: string;
  use_type: string;
  quantity: number;
}

export const getPersonTokenLog = async (
  inputData: getPersonTokenRequiredData
): Promise<AxiosResponse<PersonTokenLogType[]>> => {
  const params: { [key: string]: string } = {};
  if (inputData.start_date) {
    params['start_date'] = inputData.start_date;
  }
  if (inputData.end_date) {
    params['end_date'] = inputData.end_date;
  }
  if (inputData.use_type) {
    params['use_type'] = inputData.use_type;
  }

  try {
    const response = await axiosInstance.get(`/members/token-logs/use`);
    return response;
  } catch (error) {
    throw new Error('Unknown Error');
  }
};
