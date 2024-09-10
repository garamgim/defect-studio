import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ClipState {
  image: string; // 바이너리 형식의 이미지
  clipText: string; // 결과로 받은 clip 텍스트
}

const initialState: ClipState = {
  image: '', // 기본값: 빈 이미지
  clipText: '' // 기본값: 빈 clip 텍스트
};

const clipSlice = createSlice({
  name: 'clip',
  initialState,
  reducers: {
    setImage: (state, action: PayloadAction<string>) => {
      state.image = action.payload; // 이미지 바이너리 데이터 설정
    },
    setClipText: (state, action: PayloadAction<string>) => {
      state.clipText = action.payload; // 결과 clip 텍스트 설정
    }
  }
});

export const { setImage, setClipText } = clipSlice.actions;

export default clipSlice.reducer;
