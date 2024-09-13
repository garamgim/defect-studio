import { useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

// ------------- 부서 단위 별 토큰 기록 요청 -------------------

// Request Type
export interface DepartmentTokenStatisticRequestType {
  start_date?: string;
  end_date?: string;
  department_id: number;
}

// Response Type
export type DepartmentTokenStatisticResponseType = {
  create_date: string;
  quantity: number;
  log_type: 'distribute' | 'issue';
};

// 요청 함수
export const getDepartmentTokenStatistic = async (
  statisticType: 'distribute' | 'issue',
  requestData: DepartmentTokenStatisticRequestType
): Promise<AxiosResponse<DepartmentTokenStatisticResponseType[]>> => {
  try {
    const response = await axios.get(`/admin/token-logs/issue/${statisticType}`);
    return response;
  } catch (error) {
    if (axios.isAxiosError<DepartmentTokenStatisticResponseType[]>(error)) {
      if (error.status === 401) {
        throw new Error('Unauthorized');
      } else {
        throw new Error('Unknown Error');
      }
    } else {
      throw new Error('Unknown Error');
    }
  }
};

// Custom Hook - 요청
interface UseDepartmentTokenStatisticProps {
  departmentId: number;
  start_date?: string;
  end_date?: string;
  log_type: 'distribute' | 'issue';
}
export const useDepartmentTokenStatistic = ({
  departmentId,
  start_date,
  end_date,
  log_type
}: UseDepartmentTokenStatisticProps) => {
  const { data, error, isPending, isLoading, isError } = useQuery<
    AxiosResponse<DepartmentTokenStatisticResponseType>,
    Error,
    DepartmentTokenStatisticResponseType[],
    (string | number)[]
  >({
    queryKey: ['departmentTokenStatistic', departmentId, start_date as string, end_date as string]
  });
  return {
    data,
    error,
    isLoading,
    isPending,
    isError
  };
};
