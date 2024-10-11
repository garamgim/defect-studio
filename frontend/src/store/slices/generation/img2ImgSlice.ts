import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ModelParamsType,
  BatchParamsType,
  ImgDimensionParamsType,
  GuidanceParamsType,
  PromptParamsType,
  SamplingParamsType,
  SeedParamsType,
  UploadImgParamsType,
  StrengthParamsType
} from '../../../types/generation';

interface Img2ImgState {
  gpuNum: number | null; // 지정안하면 settings의 기본 default number 사용
  params: {
    modelParams: ModelParamsType;
    batchParams: BatchParamsType;
    imgDimensionParams: ImgDimensionParamsType;
    guidanceParams: GuidanceParamsType;
    promptParams: PromptParamsType;
    samplingParams: SamplingParamsType;
    seedParams: SeedParamsType;
    uploadImgParams: UploadImgParamsType;
    strengthParams: StrengthParamsType;
  };
}

const initialState: Img2ImgState = {
  gpuNum: 1, // null
  params: {
    modelParams: {
      model: 'stable-diffusion-2'
    },
    samplingParams: {
      scheduler: 'DPM++ 2M',
      numInferenceSteps: 50
    },
    promptParams: {
      prompt: '',
      negativePrompt: '',
      isNegativePrompt: false
    },
    guidanceParams: {
      guidanceScale: 7.5
    },
    imgDimensionParams: {
      width: 512,
      height: 512
    },
    seedParams: {
      seed: -1,
      isRandomSeed: false
    },
    batchParams: {
      batchCount: 1,
      batchSize: 1
    },
    uploadImgParams: {
      mode: 'manual',
      clipData: [],
      imageList: [],
      inputPath: '',
      outputPath: '',
      isZipDownload: false
    },
    strengthParams: {
      strength: 0.75
    }
  }
};

const img2ImgSlice = createSlice({
  name: 'img2Img',
  initialState,
  reducers: {
    setGpuNum: (state, action: PayloadAction<number | null>) => {
      state.gpuNum = action.payload;
    },

    // promptParams는 자주 업데이트 될 수 있으므로 개별 처리
    setPrompt: (state, action: PayloadAction<string>) => {
      state.params.promptParams.prompt = action.payload;
    },
    setNegativePrompt: (state, action: PayloadAction<string>) => {
      state.params.promptParams.negativePrompt = action.payload;
    },
    setIsNegativePrompt: (state, action: PayloadAction<boolean>) => {
      state.params.promptParams.isNegativePrompt = action.payload;
      if (!state.params.promptParams.isNegativePrompt) {
        state.params.promptParams.negativePrompt = '';
      }
    },

    // uploadImgParams도 자주 업데이트 될 수 있으므로 개별 처리
    setMode: (state, action: PayloadAction<'manual' | 'batch'>) => {
      state.params.uploadImgParams.mode = action.payload;
    },
    setClipData: (state, action: PayloadAction<string[]>) => {
      state.params.uploadImgParams.clipData = action.payload;
    },
    setImageList: (state, action: PayloadAction<string[]>) => {
      state.params.uploadImgParams.imageList = action.payload;
    },
    setInputPath: (state, action: PayloadAction<string>) => {
      state.params.uploadImgParams.inputPath = action.payload;
    },
    setOutputPath: (state, action: PayloadAction<string>) => {
      state.params.uploadImgParams.outputPath = action.payload;
    },
    setIsZipDownload: (state, action: PayloadAction<boolean>) => {
      state.params.uploadImgParams.isZipDownload = action.payload;
    },

    setModelParams: (state, action: PayloadAction<string>) => {
      state.params.modelParams.model = action.payload;
    },
    setStrengthParams: (state, action: PayloadAction<number>) => {
      state.params.strengthParams.strength = action.payload;
    },
    setSamplingParams: (state, action: PayloadAction<{ scheduler: string; numInferenceSteps: number }>) => {
      state.params.samplingParams = action.payload;
    },
    setGuidanceParams: (state, action: PayloadAction<number>) => {
      state.params.guidanceParams.guidanceScale = action.payload;
    },
    setImgDimensionParams: (state, action: PayloadAction<{ width: number; height: number }>) => {
      state.params.imgDimensionParams = action.payload;
    },
    setSeedParams: (state, action: PayloadAction<{ seed: number; isRandomSeed: boolean }>) => {
      state.params.seedParams = action.payload;
    },
    setBatchParams: (state, action: PayloadAction<{ batchCount: number; batchSize: number }>) => {
      state.params.batchParams = action.payload;
    },

    // params 초기화
    resetParams: (state) => {
      Object.assign(state.params, initialState.params);
    }
  }
});

export const {
  setGpuNum,
  setPrompt,
  setNegativePrompt,
  setIsNegativePrompt,
  setModelParams,
  setSamplingParams,
  setGuidanceParams,
  setImgDimensionParams,
  setSeedParams,
  setBatchParams,
  setStrengthParams,
  setMode,
  setClipData,
  setImageList,
  setInputPath,
  setOutputPath,
  resetParams,
  setIsZipDownload
} = img2ImgSlice.actions;

export default img2ImgSlice.reducer;
