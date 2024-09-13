import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CleanupState {
  initImageList: string[];
  maskImageList: string[];
  outputImgUrls: string[];
}

const initialState: CleanupState = {
  initImageList: [],
  maskImageList: [],
  outputImgUrls: []
};

const cleanupSlice = createSlice({
  name: 'cleanup',
  initialState,
  reducers: {
    setInitImageList: (state, action: PayloadAction<string[]>) => {
      state.initImageList = action.payload;
    },
    setMaskImageList: (state, action: PayloadAction<string[]>) => {
      state.maskImageList = action.payload;
    },
    setOutputImgUrls: (state, action: PayloadAction<string[]>) => {
      state.outputImgUrls = action.payload;
    }
  }
});

export const { setInitImageList, setMaskImageList, setOutputImgUrls } = cleanupSlice.actions;

export default cleanupSlice.reducer;
