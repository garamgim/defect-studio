import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SnakeToCamel } from '../../../utils/snakeToCamel';
import { RemoveBgParams } from '../../../types/generation';

interface RemoveBgState extends Omit<SnakeToCamel<RemoveBgParams>, 'imageList'> {
  mode: 'manual' | 'batch';
  imageList: string[];

  output: {
    isLoading: boolean;
    firstProcessedImg: string | null;
    imgsCount: number;
  };
  // outputImgUrls: string[];
}

const initialState: RemoveBgState = {
  mode: 'manual',
  imageList: [],
  inputPath: '',
  outputPath: '',

  output: {
    isLoading: false,
    firstProcessedImg: null,
    imgsCount: 0
  }

  // outputImgUrls: [],
  // isLoading: false
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

    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.output.isLoading = action.payload;
    },
    setFirstProcessedImg: (state, action: PayloadAction<string | null>) => {
      state.output.firstProcessedImg = action.payload;
    },
    setImgsCount: (state, action: PayloadAction<number>) => {
      state.output.imgsCount = action.payload;
    }

    // setOutputImgUrls: (state, action: PayloadAction<string[]>) => {
    //   state.outputImgUrls = action.payload;
    // },
    // setIsLoading: (state, action: PayloadAction<boolean>) => {
    //   state.isLoading = action.payload;
    // }
  }
});

export const { setImageList, setInputPath, setOutputPath, setFirstProcessedImg, setMode, setIsLoading } =
  removeBgSlice.actions;

export default removeBgSlice.reducer;
