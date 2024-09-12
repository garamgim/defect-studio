import noAuthAxios from './token/noAuthAxios';
import { loginData } from '../types/user';
import axiosInstance from './token/axiosInstance';
import { AxiosError, AxiosResponse } from 'axios';
import { useQuery, QueryClient } from '@tanstack/react-query';

// 로그인 함수
export async function login(user: loginData) {
  try {
    const formData = new URLSearchParams();
    formData.append('username', user.username);
    formData.append('password', user.password);

    const response = await noAuthAxios.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const authorizationHeader = response.headers['authorization'];

    // 토큰이 있을 경우 저장
    if (authorizationHeader) {
      const token = authorizationHeader.split(' ')[1]; // 토큰만 저장
      localStorage.setItem('accessToken', token);
      console.log('Login successful, token:', token);
      return { token };
    } else {
      throw new Error('Login failed: No token found in response headers');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

// 유저 정보 가져올 떄 쓰는 정보
export type userInfo = {
  member_pk: number;
  login_id: string;
  nickname: string;
  email: string;
  role: 'super_admin' | 'department_member' | 'department_admin';
  department_id: number;
  department_name: string;
  token_quantity: number;
};

// 서버로부터 유저 정보 가져오기
export const getUserInfo = async (): Promise<AxiosResponse<userInfo, AxiosError>> => {
  try {
    const response = await axiosInstance.get('/members');
    console.log('response Data ' + response);
    return response;
  } catch (error) {
    if ((error as AxiosError).status === 401) {
      throw Error('Not Authorized');
    }
    throw Error('Unexpected error occurred'); // Add a return statement at the end of the function
  }
};

// 커스텀 훅 -> 유저 정보 가져오기
export const useGetMyInfo = () => {
  const {
    data: myInfo,
    isPending: myInfoPending,
    isLoading: myInfoLoading,
    isError: isGetMyInfoError,
    error: myInfoError
  } = useQuery<AxiosResponse<userInfo>, AxiosError, userInfo, string[]>({
    queryKey: ['myInfo'],
    queryFn: getUserInfo,
    select: (data) => data.data
  });

  return {
    myInfo,
    myInfoPending,
    myInfoLoading,
    isGetMyInfoError,
    myInfoError
  };
};

// 내 정보 업데이트 요청하기
export const upDateMyInfo = async () => {
  const queryClient = new QueryClient();
  queryClient.invalidateQueries({
    queryKey: ['myInfo']
  });
};

// 로그아웃 함수
export async function logout() {
  try {
    localStorage.removeItem('accessToken');
    await axiosInstance.post('/auth/logout');
    const queryClient = new QueryClient();
    queryClient.removeQueries({
      queryKey: ['myInfo']
    });
    console.log('Logout successful');
    return true;
  } catch (error) {
    console.error('Error logging out:', error);

    return false;
  }
}