import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InpaintingState {
  model: string;
  prompt: string;
  negativePrompt: string;
  width: number;
  height: number;
  samplingSteps: number;
  guidanceScale: number;
  strength: number;
  seed: number;
  isRandomSeed: boolean; // 랜덤 시드 체크박스 상태
  batchCount: number;
  batchSize: number;
  isNegativePrompt: boolean; // 네거티브 프롬프트 체크박스 상태
  initImageList: File[];
  maskImageList: File[];
  initInputPath: string;
  maskInputPath: string;
  outputPath: string;
  imageUrls: string[];
}

const initialState: InpaintingState = {
  model: 'CompVis/stable-diffusion-v1-4',
  prompt: '',
  negativePrompt: '',
  width: 512,
  height: 512,
  samplingSteps: 50,
  guidanceScale: 7.5,
  strength: 0.75,
  seed: -1,
  isRandomSeed: false, // 랜덤 시드 체크박스 기본값
  batchCount: 1,
  batchSize: 1,
  isNegativePrompt: false, // 네거티브 프롬프트 체크박스 기본값
  initImageList: [],
  maskImageList: [],
  initInputPath: '',
  maskInputPath: '',
  outputPath: '/output',
  imageUrls: []
};

const inpaintingSlice = createSlice({
  name: 'inpainting',
  initialState,
  reducers: {
    setModel: (state, action: PayloadAction<string>) => {
      state.model = action.payload;
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
        state.seed = -1; // 랜덤 시드 활성화 시 seed를 -1로 설정
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
    setInitImageList: (state, action: PayloadAction<File[]>) => {
      state.initImageList = action.payload;
    },
    setMaskImageList: (state, action: PayloadAction<File[]>) => {
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
    setImageUrls: (state, action: PayloadAction<string[]>) => {
      state.imageUrls = action.payload;
    }
  }
});

export const {
  setModel,
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
  setImageUrls
} = inpaintingSlice.actions;

export default inpaintingSlice.reducer;
