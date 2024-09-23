import { AxiosResponse } from 'axios';
import axiosInstance from './token/axiosInstance';

export type RoleType = 'guest' | 'department_member' | 'department_admin' | 'super_admin';

// Guest Member 정보 가져오기

export type MemberRead = {
  member_id: number;
  login_id: string;
  nickname: string;
  email: string;
  role: RoleType;
  department_id: number;
  department_name: string;
  token_quantity: number;
};

// 정보 요청
export const getGuestUserInfo = async (): Promise<AxiosResponse<MemberRead[]>> => {
  try {
    const response = await axiosInstance.get<MemberRead[]>('/admin/members/guests');
    console.log(response.data);
    return response;
  } catch (error) {
    throw Error('Unexpected error occurred');
  }
};

// 관리자 승인 함수

export interface ApproveGuestUserProps {
  member_pk: number;
  new_role: Omit<RoleType, 'guest'>;
}

export const approveGuestUser = async ({
  member_pk,
  new_role
}: ApproveGuestUserProps): Promise<AxiosResponse<string>> => {
  try {
    const response = await axiosInstance.patch(`/admin/members/guests/${member_pk}`, null, {
      params: {
        new_role
      }
    });
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw Error(error.response?.data.message || 'Something went wrong');
    } else if (error.response?.status === 404) {
      throw Error('해당 임시 회원을 찾을 수 없습니다.');
    } else if (error.response?.status === 403) {
      throw Error('권한이 없습니다.');
    } else {
      throw new Error('Unexpected error occurred');
    }
  }
};

// 관리자 거절 함수
export const rejectGuestUser = async (member_pk: number): Promise<AxiosResponse<string>> => {
  try {
    const response = await axiosInstance.delete(`/admin/members/guests/${member_pk}`);
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw Error(error.response?.data.message || 'Something went wrong');
    } else if (error.response?.status === 404) {
      throw Error('해당 임시 회원을 찾을 수 없습니다.');
    } else if (error.response?.status === 403) {
      throw Error('권한이 없습니다.');
    } else {
      throw new Error('Unexpected error occurred');
    }
  }
};
