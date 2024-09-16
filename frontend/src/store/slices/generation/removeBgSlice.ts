import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RemoveBgState {
  mode: 'manual' | 'batch';
  images: string[];
  inputPath: string;
  outputPath: string;
  outputImgUrls: string[];

  isLoading: boolean;
}

const initialState: RemoveBgState = {
  mode: 'manual',
  images: [],
  inputPath: '',
  outputPath: '',
  outputImgUrls: [],

  isLoading: false
};

const removeBgSlice = createSlice({
  name: 'removeBg',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<'manual' | 'batch'>) => {
      state.mode = action.payload;
    },
    setImages: (state, action: PayloadAction<string[]>) => {
      state.images = action.payload;
    },
    setInputPath: (state, action: PayloadAction<string>) => {
      state.inputPath = action.payload;
    },
    setOutputPath: (state, action: PayloadAction<string>) => {
      state.outputPath = action.payload;
    },
    setOutputImgUrls: (state, action: PayloadAction<string[]>) => {
      state.outputImgUrls = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

export const { setImages, setInputPath, setOutputPath, setOutputImgUrls, setMode, setIsLoading } =
  removeBgSlice.actions;

export default removeBgSlice.reducer;
