import { useQuery } from '@tanstack/react-query';
import { getDeviceHealth, getDeviceCudaAvailable, getDeviceCudaUsage } from '@api/settings';
import { AxiosResponse } from 'axios';
import { GpuInfoType } from '@/types/settings';

// GPU 서버 연결 상태 확인
export const useGetDeviceHealth = () => {
  const { data, isLoading, isPending, isError, error } = useQuery<string, Error, string, string[]>({
    queryFn: getDeviceHealth,
    queryKey: ['deviceHealth'],
    enabled: true,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  });
  return {
    data,
    isLoading,
    isPending,
    isError,
    error
  };
};

// CUDA 사용 가능 여부 확인
export const useGetDeviceCudaAvailable = () => {
  const { data, isLoading, isPending, isError, error } = useQuery<AxiosResponse<string>, Error, string, string[]>({
    queryFn: getDeviceCudaAvailable,
    queryKey: ['deviceCudaAvailable'],
    enabled: true,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  });
  return {
    data,
    isLoading,
    isPending,
    isError,
    error
  };
};

// Cuda 사용량 확인
export const useGetDeviceCudaUsage = () => {
  const { data, isLoading, isPending, isError, error } = useQuery<GpuInfoType[], Error, GpuInfoType[], string[]>({
    queryFn: getDeviceCudaUsage,
    queryKey: ['deviceCudaUsage'],
    enabled: true,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  });
  return {
    data,
    isLoading,
    isPending,
    isError,
    error
  };
};
