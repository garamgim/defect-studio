import noAuthAxios from './token/noAuthAxios';
import { loginData } from '../types/user';
import axiosInstance from './token/axiosInstance';
import { AxiosError, AxiosResponse } from 'axios';
import { queryClient } from '../main';
import { userInfoType } from '@/types/user';

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

// 서버로부터 유저 정보 가져오기
export const getUserInfo = async (): Promise<AxiosResponse<userInfoType, AxiosError>> => {
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

// 내 정보 업데이트 요청하기
export const upDateMyInfo = async () => {
  queryClient.invalidateQueries({
    queryKey: ['myInfo']
  });
};

// 로그아웃 함수
export async function logout() {
  try {
    localStorage.removeItem('accessToken');
    await axiosInstance.post('/auth/logout');
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

// 유저 정보 수정 --------
interface EditProfileInputs {
  email?: string;
  nickname?: string;
  password?: string;
}

export const editProfile = async (data: EditProfileInputs) => {
  const submitData: { [key: string]: string } = {};
  if (data.email) submitData.email = data.email;
  if (data.nickname) submitData.nickname = data.nickname;
  if (data.password) submitData.password = data.password;
  try {
    const response = await axiosInstance.patch('/members', submitData);
    return response;
  } catch (error) {
    console.error('Error editing profile:', error);
    throw error;
  }
};

// 회원탈퇴
export const deleteProfile = async () => {
  try {
    const response = await axiosInstance.delete('/members');
    localStorage.removeItem('accessToken');
    queryClient.invalidateQueries({
      queryKey: ['myInfo'],
      refetchType: 'none'
    });
    queryClient.removeQueries({
      queryKey: ['myInfo']
    });
    return response;
  } catch (error) {
    console.error('Error deleting profile:', error);
    throw error;
  }
};
