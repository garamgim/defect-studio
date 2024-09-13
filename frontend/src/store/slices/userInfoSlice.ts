import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type userStatus = {
  member_pk: number;
  login_id: string;
  nickname: string;
  email: string;
  role: 'super_admin' | 'department_member' | 'department_admin';
  department_id: number;
  department_name: string;
  token_quantity: number;
};

const initialState: userStatus = {
  member_pk: -1,
  login_id: '',
  nickname: '',
  email: '',
  role: 'department_member',
  department_id: -1,
  department_name: '',
  token_quantity: 0
};

const userInfoSlice = createSlice({
  name: 'userInfoStatus',
  initialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<userStatus>) {
      state.member_pk = action.payload.member_pk;
      state.login_id = action.payload.login_id;
      state.nickname = action.payload.nickname;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.department_id = action.payload.department_id;
      state.department_name = action.payload.department_name;
      state.token_quantity = action.payload.token_quantity;
    },
    removeUserInfo(state) {
      state.member_pk = initialState.member_pk;
      state.login_id = initialState.login_id;
      state.nickname = initialState.nickname;
      state.email = initialState.email;
      state.role = initialState.role;
      state.department_id = initialState.department_id;
      state.department_name = initialState.department_name;
      state.token_quantity = initialState.token_quantity;
    }
  }
});

export const { setUserInfo, removeUserInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;
