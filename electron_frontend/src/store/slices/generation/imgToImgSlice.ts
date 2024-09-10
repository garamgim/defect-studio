import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ImgToImgState {
  model: string;
  prompt: string;
  negativePrompt: string;
  width: number;
  height: number;
  samplingSteps: number;
  samplingMethod: string;
  guidanceScale: number;
  strength: number;
  seed: number;
  isRandomSeed: boolean;
  batchCount: number;
  batchSize: number;
  images: File[]; // 초기 이미지 배열
  inputPath: string;
  outputPath: string;
  isNegativePrompt: boolean;
  imageUrls: string[]; // 생성된 이미지 배열
}

const initialState: ImgToImgState = {
  model: 'CompVis/stable-diffusion-v1-4',
  prompt: '',
  negativePrompt: '',
  width: 512,
  height: 512,
  samplingSteps: 50,
  samplingMethod: '',
  guidanceScale: 7.5,
  strength: 0.75,
  seed: -1,
  isRandomSeed: false, // 기본값: 랜덤 시드 비활성화
  batchCount: 1,
  batchSize: 1,
  images: [],
  inputPath: '',
  outputPath: '',
  isNegativePrompt: false, // 기본값: 네거티브 프롬프트 비활성화
  imageUrls: []
};

const imgToImgSlice = createSlice({
  name: 'imgToImg',
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
    setIsNegativePrompt: (state, action: PayloadAction<boolean>) => {
      state.isNegativePrompt = action.payload;
      if (!state.isNegativePrompt) {
        state.negativePrompt = ''; // 비활성화 시 네거티브 프롬프트 초기화
      }
    },
    setBatchCount: (state, action: PayloadAction<number>) => {
      state.batchCount = action.payload;
    },
    setBatchSize: (state, action: PayloadAction<number>) => {
      state.batchSize = action.payload;
    },
    setImages: (state, action: PayloadAction<File[]>) => {
      state.images = action.payload;
    },
    setInputPath: (state, action: PayloadAction<string>) => {
      state.inputPath = action.payload;
    },
    setOutputPath: (state, action: PayloadAction<string>) => {
      state.outputPath = action.payload;
    },
    setImageUrls: (state, action: PayloadAction<string[]>) => {
      state.imageUrls = action.payload;
    },
    setSamplingMethod: (state, action: PayloadAction<string>) => {
      state.samplingMethod = action.payload;
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
  setSamplingMethod,
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
  setImageUrls
} = imgToImgSlice.actions;

export default imgToImgSlice.reducer;
