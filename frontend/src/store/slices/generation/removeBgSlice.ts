import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SnakeToCamel } from '../../../utils/snakeToCamel';
import { RemoveBgParams } from '../../../types/generation';

interface RemoveBgState extends Omit<SnakeToCamel<RemoveBgParams>, 'imageList'> {
  mode: 'manual' | 'batch';
  imageList: string[];

  outputImgUrls: string[];
  isLoading: boolean;
}

const initialState: RemoveBgState = {
  mode: 'manual',
  imageList: [],
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
    setImageList: (state, action: PayloadAction<string[]>) => {
      state.imageList = action.payload;
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

export const { setImageList, setInputPath, setOutputPath, setOutputImgUrls, setMode, setIsLoading } =
  removeBgSlice.actions;

export default removeBgSlice.reducer;
