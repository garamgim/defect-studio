import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SnakeToCamel } from '../../../utils/snakeToCamel';
import { Txt2ImgParams } from '../../../types/generation';

export interface Txt2ImgState extends SnakeToCamel<Txt2ImgParams> {
  isRandomSeed: boolean;
  isNegativePrompt: boolean;

  outputImgUrls: string[];
  isLoading: boolean;
}

const initialState: Txt2ImgState = {
  model: 'stable-diffusion-2',
  scheduler: 'DPM++ 2M',
  prompt: '',
  negativePrompt: '',
  width: 512,
  height: 512,
  numInferenceSteps: 50,
  guidanceScale: 7.5,
  seed: -1,
  isRandomSeed: false,
  batchCount: 1,
  batchSize: 1,
  outputPath: '',
  isNegativePrompt: false,
  outputImgUrls: [],
  isLoading: false
};

const txt2ImgSlice = createSlice({
  name: 'txt2Img',
  initialState,
  reducers: {
    setModel: (state, action: PayloadAction<string>) => {
      state.model = action.payload;
    },
    setScheduler: (state, action: PayloadAction<string>) => {
      state.scheduler = action.payload;
    },
    setPrompt: (state, action: PayloadAction<string>) => {
      state.prompt = action.payload;
    },
    setNegativePrompt: (state, action: PayloadAction<string>) => {
      state.negativePrompt = action.payload;
    },
    setWidth: (state, action: PayloadAction<number>) => {
      state.width = action.payload;
    },
    setHeight: (state, action: PayloadAction<number>) => {
      state.height = action.payload;
    },
    setNumInferenceSteps: (state, action: PayloadAction<number>) => {
      state.numInferenceSteps = action.payload;
    },
    setGuidanceScale: (state, action: PayloadAction<number>) => {
      state.guidanceScale = action.payload;
    },
    setSeed: (state, action: PayloadAction<number>) => {
      state.seed = action.payload;
    },
    setIsRandomSeed: (state, action: PayloadAction<boolean>) => {
      state.isRandomSeed = action.payload;
      if (state.isRandomSeed) {
        state.seed = -1;
      }
    },
    setBatchCount: (state, action: PayloadAction<number>) => {
      state.batchCount = action.payload;
    },
    setBatchSize: (state, action: PayloadAction<number>) => {
      state.batchSize = action.payload;
    },
    setOutputPath: (state, action: PayloadAction<string>) => {
      state.outputPath = action.payload;
    },
    setIsNegativePrompt: (state, action: PayloadAction<boolean>) => {
      state.isNegativePrompt = action.payload;
      if (!state.isNegativePrompt) {
        state.negativePrompt = ''; // 네거티브 프롬프트 비활성화 시 초기화
      }
    },
    setOutputImgUrls: (state, action: PayloadAction<string[]>) => {
      state.outputImgUrls = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    resetState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setModel,
  setScheduler,
  setPrompt,
  setNegativePrompt,
  setWidth,
  setHeight,
  setNumInferenceSteps,
  setGuidanceScale,
  setSeed,
  setIsRandomSeed,
  setBatchCount,
  setBatchSize,
  setOutputPath,
  setIsNegativePrompt,
  setOutputImgUrls,
  setIsLoading,
  resetState
} = txt2ImgSlice.actions;

export default txt2ImgSlice.reducer;
