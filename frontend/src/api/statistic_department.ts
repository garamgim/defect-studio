import { useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import axiosInstance from './token/axiosInstance';

type logType = 'distribute' | 'issue' | 'use';
// ------------- 부서 단위 별 토큰 기록 요청 -------------------

// Request Type
export interface DepartmentTokenStatisticRequestType {
  start_date: string;
  end_date: string;
  department_id: number;
  log_type: logType;
}

// Response Type
export type DepartmentTokenStatisticResponseType = {
  create_date: string;
  quantity: number;
  log_type: logType;
};

// 요청 함수
export const getDepartmentTokenStatistic = async (
  requestData: DepartmentTokenStatisticRequestType
): Promise<AxiosResponse<DepartmentTokenStatisticResponseType[]>> => {
  const params: { [key: string]: string | number } = {};
  params.start_date = requestData.start_date;
  params.end_date = requestData.end_date;
  params.department_id = requestData.department_id;

  try {
    const response = await axiosInstance.get<DepartmentTokenStatisticResponseType[]>(
      `/admin/token-logs/${requestData.log_type}`,
      {
        params
      }
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError<DepartmentTokenStatisticResponseType[]>(error)) {
      if (error.response?.status === 401) {
        throw new Error('Unauthorized'); // 권한 없음
      } else if (error.response?.status === 404) {
        throw new Error('Not Found'); // 없음
      } else if (error.response?.status === 422) {
        throw new Error('Unprocessable Entity'); // 누락
      } else {
        throw new Error('Unknown Error'); // 알수 없는 에러
      }
    } else {
      throw new Error('Unknown Error'); // 알수 없는 에러
    }
  }
};

// Custom Hook - 요청
interface UseDepartmentTokenStatisticProps {
  departmentId: number;
  start_date: string;
  end_date: string;
  log_type: 'distribute' | 'issue';
}
export const useDepartmentTokenStatistic = ({
  departmentId,
  start_date,
  end_date,
  log_type
}: UseDepartmentTokenStatisticProps) => {
  const { data, error, isPending, isLoading, isError } = useQuery<
    DepartmentTokenStatisticResponseType[],
    Error,
    DepartmentTokenStatisticResponseType[],
    (string | number)[]
  >({
    queryKey: ['departmentTokenStatistic', departmentId, start_date as string, end_date as string],
    queryFn: async () => {
      const response = await getDepartmentTokenStatistic({
        department_id: departmentId,
        start_date,
        end_date,
        log_type
      });
      console.log(response.data);
      return response.data;
    }
  });
  return {
    data,
    error,
    isLoading,
    isPending,
    isError
  };
};
