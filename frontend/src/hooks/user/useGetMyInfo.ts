import { AxiosError, AxiosResponse } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from '@api/user';
import { userInfoType } from '@/types/user';

// 커스텀 훅 -> 유저 정보 가져오기
export const useGetMyInfo = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const {
    data: myInfo,
    isPending: myInfoPending,
    isLoading: myInfoLoading,
    isError: isGetMyInfoError,
    error: myInfoError
  } = useQuery<AxiosResponse<userInfoType>, AxiosError, userInfoType, string[]>({
    queryKey: ['myInfo'],
    queryFn: getUserInfo,
    select: (data) => data.data,
    enabled: isLoggedIn,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  return {
    myInfo,
    myInfoPending,
    myInfoLoading,
    isGetMyInfoError,
    myInfoError
  };
};
