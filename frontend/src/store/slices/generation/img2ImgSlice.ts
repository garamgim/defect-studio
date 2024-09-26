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
  isLoading: boolean;
  taskId: string | null;
  checkedOutput: boolean;
  output: {
    processedImgsCnt: number;
    outputImgs: string[];
    firstProcessedImg: string | null;
  };
}

const initialState: Img2ImgState = {
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
      outputPath: ''
    },
    strengthParams: {
      strength: 0.75
    }
  },
  isLoading: false,
  taskId: null,
  checkedOutput: true,
  output: {
    processedImgsCnt: 0,
    outputImgs: [],
    firstProcessedImg: null
  }
};

const img2ImgSlice = createSlice({
  name: 'img2Img',
  initialState,
  reducers: {
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

    // 이미지 생성 체크를 위한 로딩
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    // 이미지 생성 체크를 위해 받는 id값
    setTaskId: (state, action: PayloadAction<string | null>) => {
      state.taskId = action.payload;
    },
    // 이미지 생성 후 생성된 이미지 확인 했는지 체크
    setCheckedOutput: (state, action: PayloadAction<boolean>) => {
      state.checkedOutput = action.payload;
    },
    // output
    setProcessedImgsCnt: (state, action: PayloadAction<number>) => {
      state.output.processedImgsCnt = action.payload;
    },
    setFirstProcessedImg: (state, action: PayloadAction<string | null>) => {
      state.output.firstProcessedImg = action.payload;
    },
    setOutputImgs: (state, action: PayloadAction<string[]>) => {
      state.output.outputImgs = action.payload;
    },

    // params 초기화
    resetState: (state) => {
      Object.assign(state.params, initialState.params);
    }
  }
});

export const {
  setPrompt,
  setNegativePrompt,
  setIsNegativePrompt,
  setModelParams,
  setSamplingParams,
  setGuidanceParams,
  setImgDimensionParams,
  setSeedParams,
  setBatchParams,
  setIsLoading,
  setTaskId,
  setCheckedOutput,
  setProcessedImgsCnt,
  setFirstProcessedImg,
  setOutputImgs,
  setStrengthParams,
  setMode,
  setClipData,
  setImageList,
  setInputPath,
  setOutputPath,
  resetState
} = img2ImgSlice.actions;

export default img2ImgSlice.reducer;
