import { AxiosResponse } from 'axios';
import axiosInstance from './token/axiosInstance';

export type RoleType = 'guest' | 'department_member' | 'department_admin' | 'super_admin';

// Member 정보 가져오기 --------------------

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

// Guest ------------------------------------------

// 정보 요청
export const getGuestUserInfo = async (): Promise<AxiosResponse<MemberRead[]>> => {
  try {
    const response = await axiosInstance.get<MemberRead[]>('/members/guests');
    return response;
  } catch (error) {
    throw Error('Unexpected error occurred');
  }
};

// 관리자 승인 함수

export interface ApproveGuestUserProps {
  member_id: number;
  new_role: Omit<RoleType, 'guest'>;
}

export const approveUser = async ({ member_id, new_role }: ApproveGuestUserProps): Promise<AxiosResponse<string>> => {
  try {
    const response = await axiosInstance.patch(`/members/${member_id}/role`, null, {
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

export interface RejectGuestUserProps {
  member_id: number;
}
export const rejectUser = async ({ member_id }: RejectGuestUserProps): Promise<AxiosResponse<string>> => {
  try {
    const response = await axiosInstance.delete(`/members/${member_id}`);
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

// 이미 가입한 회원 ----------------------

// 모든 회원들에 대한 요청
export const getUserInfo = async (): Promise<AxiosResponse<MemberRead[]>> => {
  try {
    const response = await axiosInstance.get<MemberRead[]>('/members/all');
    return response;
  } catch (error) {
    throw Error('Unexpected error occurred');
  }
};
