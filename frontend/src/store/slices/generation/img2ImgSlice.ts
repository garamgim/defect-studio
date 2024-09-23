import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SnakeToCamel } from '../../../utils/snakeToCamel';
import { Img2ImgParams } from '../../../types/generation';

interface Img2ImgState extends Omit<SnakeToCamel<Img2ImgParams>, 'imageList'> {
  mode: 'manual' | 'batch';
  isRandomSeed: boolean;
  isNegativePrompt: boolean;
  outputImgUrls: string[]; // 생성된 이미지 배열
  clipData: string[];
  imageList: string[]; // string[]으로 재정의

  // skeleton ui에 이용
  isLoading: boolean;
  uploadImgsCount: number;
}

const initialState: Img2ImgState = {
  mode: 'manual',
  model: 'stable-diffusion-2',
  scheduler: 'DPM++ 2M',
  prompt: '',
  negativePrompt: '',
  width: 512,
  height: 512,
  numInferenceSteps: 50,
  guidanceScale: 7.5,
  strength: 0.75,
  seed: -1,
  isRandomSeed: false,
  batchCount: 1,
  batchSize: 1,
  imageList: [],
  inputPath: '',
  outputPath: '',
  isNegativePrompt: false,
  outputImgUrls: [],
  clipData: [],
  isLoading: false,
  uploadImgsCount: 1
};

const img2ImgSlice = createSlice({
  name: 'img2Img',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<'manual' | 'batch'>) => {
      state.mode = action.payload;
    },
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
    setStrength: (state, action: PayloadAction<number>) => {
      state.strength = action.payload;
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
    setIsNegativePrompt: (state, action: PayloadAction<boolean>) => {
      state.isNegativePrompt = action.payload;
      if (!state.isNegativePrompt) {
        state.negativePrompt = ''; // 네거티브 프롬프트 비활성화 시 초기화
      }
    },
    setBatchCount: (state, action: PayloadAction<number>) => {
      state.batchCount = action.payload;
    },
    setBatchSize: (state, action: PayloadAction<number>) => {
      state.batchSize = action.payload;
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
    setClipData: (state, action: PayloadAction<string[]>) => {
      state.clipData = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUploadImgsCount: (state, action: PayloadAction<number>) => {
      state.uploadImgsCount = action.payload;
    },
    resetState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setMode,
  setModel,
  setScheduler,
  setPrompt,
  setNegativePrompt,
  setWidth,
  setHeight,
  setNumInferenceSteps,
  setGuidanceScale,
  setStrength,
  setSeed,
  setIsRandomSeed,
  setIsNegativePrompt,
  setBatchCount,
  setBatchSize,
  setImageList,
  setInputPath,
  setOutputPath,
  setOutputImgUrls,
  setClipData,
  setIsLoading,
  setUploadImgsCount,
  resetState
} = img2ImgSlice.actions;

export default img2ImgSlice.reducer;
