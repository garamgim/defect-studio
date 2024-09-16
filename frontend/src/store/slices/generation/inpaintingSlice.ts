import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InpaintingState {
  mode: 'manual' | 'batch';
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
  isNegativePrompt: boolean;
  initImageList: string[];
  maskImageList: string[];
  initInputPath: string;
  maskInputPath: string;
  outputPath: string;
  outputImgUrls: string[];
  clipData: string[];

  // skeleton ui에 이용
  isLoading: boolean;
  uploadImgsCount: number;
}

const initialState: InpaintingState = {
  mode: 'manual',
  model: 'CompVis/stable-diffusion-v1-4',
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
  isNegativePrompt: false,
  initImageList: [],
  maskImageList: [],
  initInputPath: '',
  maskInputPath: '',
  outputPath: '',
  outputImgUrls: [],
  clipData: [],

  isLoading: false,
  uploadImgsCount: 1
};

const inpaintingSlice = createSlice({
  name: 'inpainting',
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
    setBatchCount: (state, action: PayloadAction<number>) => {
      state.batchCount = action.payload;
    },
    setBatchSize: (state, action: PayloadAction<number>) => {
      state.batchSize = action.payload;
    },
    setIsNegativePrompt: (state, action: PayloadAction<boolean>) => {
      state.isNegativePrompt = action.payload;
      if (!state.isNegativePrompt) {
        state.negativePrompt = ''; // 네거티브 프롬프트 비활성화 시 초기화
      }
    },
    setInitImageList: (state, action: PayloadAction<string[]>) => {
      state.initImageList = action.payload;
    },
    setMaskImageList: (state, action: PayloadAction<string[]>) => {
      state.maskImageList = action.payload;
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
  setBatchCount,
  setBatchSize,
  setIsNegativePrompt,
  setInitImageList,
  setMaskImageList,
  setInitInputPath,
  setMaskInputPath,
  setOutputPath,
  setOutputImgUrls,
  setClipData,
  setIsLoading,
  setUploadImgsCount
} = inpaintingSlice.actions;

export default inpaintingSlice.reducer;
