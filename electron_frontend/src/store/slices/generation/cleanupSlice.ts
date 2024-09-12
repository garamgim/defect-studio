import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CleanupState {
  images: string[];
  masks: string[];
  outputImgUrls: string[];
}

const initialState: CleanupState = {
  images: [],
  masks: [],
  outputImgUrls: []
};

const cleanupSlice = createSlice({
  name: 'cleanup',
  initialState,
  reducers: {
    setImages: (state, action: PayloadAction<string[]>) => {
      state.images = action.payload;
    },
    setMasks: (state, action: PayloadAction<string[]>) => {
      state.masks = action.payload;
    },
    setOutputImgUrls: (state, action: PayloadAction<string[]>) => {
      state.outputImgUrls = action.payload;
    }
  }
});

export const { setImages, setMasks, setOutputImgUrls } = cleanupSlice.actions;

export default cleanupSlice.reducer;
