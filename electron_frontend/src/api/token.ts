import { AxiosError, AxiosResponse } from 'axios';
import axiosInstance from './token/axiosInstance';

export interface TokenIssueRequestType {
  end_date: string;
  quantity: number;
  department_ids: number[];
}

export const createTokenIssue = async (data: TokenIssueRequestType) => {
  try {
    const response = await axiosInstance.post('/admin/tokens', data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export interface TokenReadType {
  token_id: number;
  start_date: string;
  end_date: string;
  origin_quantity: number;
  remain_quantity: number;
  is_active: boolean;
  department_id: number;
}

export interface TokenReadResponseType {
  department_id: number;
  department_name: string;
  tokens: TokenReadType[];
}

export const getDepartmentTokenUsage = async (
  departmentId?: number
): Promise<AxiosResponse<TokenReadResponseType[]>> => {
  try {
    if (departmentId === undefined) {
      const response = await axiosInstance.get('/admin/tokens');
      return response;
    } else {
      const response = await axiosInstance.get(`/admin/tokens?department_id=${departmentId}`);
      return response;
    }
  } catch (error) {
    throw new AxiosError('Error');
  }
};

export interface TokenDistributeRequestType {
  quantity: number;
  member_ids: number[];
}

interface distributeTokenRequestType {
  token_id: number;
  data: TokenDistributeRequestType;
}

export const distributeTokenRequest = async ({
  token_id,
  data
}: distributeTokenRequestType): Promise<AxiosResponse<string>> => {
  try {
    const response = await axiosInstance.post(`/admin/tokens/${token_id}`, data);
    return response;
  } catch (error) {
    throw new AxiosError('Error');
  }
};
