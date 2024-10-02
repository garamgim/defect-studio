export interface signUpFormType {
  login_id: string;
  password: string;
  name: string;
  nickname: string;
  email: string;
  department_id: number;
}

export interface loginData {
  username: string;
  password: string;
}

// 유저 정보 가져올 떄 쓰는 정보
export type userInfoType = {
  member_id: number;
  login_id: string;
  nickname: string;
  email: string;
  role: 'super_admin' | 'department_member' | 'department_admin';
  department_id: number;
  department_name: string;
  token_quantity: number;
};
