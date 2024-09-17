import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CleanupState {
  mode: 'manual' | 'batch';
  initImageList: string[];
  maskImageList: string[];
  outputImgUrls: string[];
  initInputPath: string;
  maskInputPath: string;
  outputPath: string;

  isLoading: boolean;
}

const initialState: CleanupState = {
  mode: 'manual',
  initImageList: [],
  maskImageList: [],
  outputImgUrls: [],
  initInputPath: '',
  maskInputPath: '',
  outputPath: '',

  isLoading: false
};

const cleanupSlice = createSlice({
  name: 'cleanup',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<'manual' | 'batch'>) => {
      state.mode = action.payload;
    },
    setInitImageList: (state, action: PayloadAction<string[]>) => {
      state.initImageList = action.payload;
    },
    setMaskImageList: (state, action: PayloadAction<string[]>) => {
      state.maskImageList = action.payload;
    },
    setOutputImgUrls: (state, action: PayloadAction<string[]>) => {
      state.outputImgUrls = action.payload;
    },
    setInitInputPath: (state, action: PayloadAction<string>) => {
      state.initInputPath = action.payload;
    },
    setMaskInputPath: (state, action: PayloadAction<string>) => {
      state.maskInputPath = action.payload;
    },
    setOutputPath: (state, action: PayloadAction<string>) => {
      state.outputPath = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

export const {
  setInitImageList,
  setMaskImageList,
  setOutputImgUrls,
  setInitInputPath,
  setMaskInputPath,
  setOutputPath,
  setIsLoading,
  setMode
} = cleanupSlice.actions;

export default cleanupSlice.reducer;
