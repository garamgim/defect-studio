import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RemoveBgState {
  images: string[]; 
  inputPath: string;
  outputPath: string;
  outputImgUrls: string[];
}

const initialState: RemoveBgState = {
  images: [],
  inputPath: '',
  outputPath: '',
  outputImgUrls: []
};

const removeBgSlice = createSlice({
  name: 'removeBg',
  initialState,
  reducers: {
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
    }
  }
});

export const { setImages, setInputPath, setOutputPath, setOutputImgUrls } = removeBgSlice.actions;

export default removeBgSlice.reducer;
