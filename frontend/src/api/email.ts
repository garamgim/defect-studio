import { AxiosResponse } from 'axios';
import noAuthAxios from './token/noAuthAxios';

// 이메일 인증 코드 전송
export const sendEmailVerifyCode = async (name: string, email: string): Promise<AxiosResponse<string>> => {
  try {
    return await noAuthAxios.post('/email/verify', {
      name,
      email
    });
  } catch (error) {
    console.error(error);
    throw new Error('이메일 인증 코드 전송에 실패했습니다.');
  }
};

export const checkEmailVerifyCode = async (email: string, code: string): Promise<AxiosResponse<string>> => {
  try {
    return await noAuthAxios.post('/members/email/verification', {
      email,
      code
    });
  } catch (error) {
    console.error(error);
    throw new Error('이메일 인증에 실패했습니다.');
  }
};
