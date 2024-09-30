import axios, { AxiosResponse } from 'axios';
import axiosInstance from '@api/token/axiosInstance';
import {
  MemberImageCount,
  ToolFrequency,
  durationSearchProps,
  TokenDistribution,
  DepartmentMemberTokenUsage
} from '@/types/statistics';

// 부서 내 사용자별 생성 이미지 수
export const getDepartmentMemberImageCount = async (
  department_id: number
): Promise<AxiosResponse<MemberImageCount[]>> => {
  try {
    const response = await axiosInstance.get<MemberImageCount[]>(
      `/departments/${department_id}/members/statistics/images`
    );
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

// 부서 내 도구별 사용 빈도
export const getDepartmentToolFrequency = async (department_id: number): Promise<AxiosResponse<ToolFrequency[]>> => {
  try {
    const response = await axiosInstance.get<ToolFrequency[]>(`/departments/${department_id}/statistics/tools`);
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

// 부서 내 토큰 배분 현황
export const getDepartmentTokenDistributionState = async (
  department_id: number,
  durationSearchProps?: durationSearchProps
): Promise<AxiosResponse<TokenDistribution[]>> => {
  const queryParams: durationSearchProps = {};
  if (queryParams?.start_date) queryParams.start_date = durationSearchProps?.start_date;
  if (queryParams?.end_date) queryParams.end_date = durationSearchProps?.end_date;
  try {
    const response = await axiosInstance.get<TokenDistribution[]>(
      `/departments/${department_id}/statistics/tokens/distributions`,
      {
        params: queryParams
      }
    );
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

// 부서 내 사용자별 토큰 사용 현황
export const getDepartmentMembersTokenUsage = async (
  department_id: number
): Promise<AxiosResponse<DepartmentMemberTokenUsage[]>> => {
  try {
    const response = await axiosInstance.get<DepartmentMemberTokenUsage[]>(
      `/departments/${department_id}/members/statistics/tokens/usage`
    );
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
