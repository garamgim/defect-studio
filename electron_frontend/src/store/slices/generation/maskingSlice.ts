import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MaskingState {
  stageImage: string | null; 
  canvasImage: string | null;
  combinedImage: string | null;
}

const initialState: MaskingState = {
  stageImage: null,
  canvasImage: null,
  combinedImage: null,
};

const maskingSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    saveImages: (state, action: PayloadAction<MaskingState>) => {
      state.stageImage = action.payload.stageImage;
      state.canvasImage = action.payload.canvasImage;
      state.combinedImage = action.payload.combinedImage;
    },
  },
});

export const { saveImages } = maskingSlice.actions;
export default maskingSlice.reducer;
