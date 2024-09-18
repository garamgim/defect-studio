// 배경이미지, 마스킹이미지, 배경+마스킹 이미지 저장
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MaskingState {
  BgImage: string | null;
  canvasImage: string | null;
  combinedImage: string | null;
}

const initialState: MaskingState = {
  BgImage: null,
  canvasImage: null,
  combinedImage: null
};

const maskingSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    saveImages: (state, action: PayloadAction<MaskingState>) => {
      state.BgImage = action.payload.BgImage;
      state.canvasImage = action.payload.canvasImage;
      state.combinedImage = action.payload.combinedImage;
    }
  }
});

export const { saveImages } = maskingSlice.actions;
export default maskingSlice.reducer;
