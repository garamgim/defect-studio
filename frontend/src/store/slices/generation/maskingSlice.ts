// 배경이미지, 마스킹이미지, 배경+마스킹 이미지 저장
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MaskingState {
  backgroundImg: string | null;
  canvasImg: string | null;
  combinedImg: string | null;
}

const initialState: MaskingState = {
  backgroundImg: null,
  canvasImg: null,
  combinedImg: null
};

const maskingSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    saveImages: (state, action: PayloadAction<MaskingState>) => {
      state.backgroundImg = action.payload.backgroundImg;
      state.canvasImg = action.payload.canvasImg;
      state.combinedImg = action.payload.combinedImg;
    }
  }
});

export const { saveImages } = maskingSlice.actions;
export default maskingSlice.reducer;
