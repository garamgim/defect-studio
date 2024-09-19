import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Img2ImgState {
  mode: 'manual' | 'batch'; // 메뉴얼/배치 모드 구분
  model: string;
  scheduler: string;
  prompt: string;
  negativePrompt: string;
  width: number;
  height: number;
  samplingSteps: number;
  guidanceScale: number;
  strength: number;
  seed: number;
  isRandomSeed: boolean;
  batchCount: number;
  batchSize: number;
  images: string[];
  inputPath: string;
  outputPath: string;
  isNegativePrompt: boolean;
  outputImgUrls: string[]; // 생성된 이미지 배열
  clipData: string[];

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
  samplingSteps: 50,
  guidanceScale: 7.5,
  strength: 0.75,
  seed: -1,
  isRandomSeed: false,
  batchCount: 1,
  batchSize: 1,
  images: [],
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
    setSamplingSteps: (state, action: PayloadAction<number>) => {
      state.samplingSteps = action.payload;
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
    setClipData: (state, action: PayloadAction<string[]>) => {
      state.clipData = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUploadImgsCount: (state, action: PayloadAction<number>) => {
      state.uploadImgsCount = action.payload;
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
  setSamplingSteps,
  setGuidanceScale,
  setStrength,
  setSeed,
  setIsRandomSeed,
  setIsNegativePrompt,
  setBatchCount,
  setBatchSize,
  setImages,
  setInputPath,
  setOutputPath,
  setOutputImgUrls,
  setClipData,
  setIsLoading,
  setUploadImgsCount
} = img2ImgSlice.actions;

export default img2ImgSlice.reducer;
