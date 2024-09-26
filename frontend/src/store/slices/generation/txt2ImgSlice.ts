import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ModelParamsType,
  BatchParamsType,
  ImgDimensionParamsType,
  GuidanceParamsType,
  PromptParamsType,
  SamplingParamsType,
  SeedParamsType
} from '../../../types/generation';

export interface Txt2ImgState {
  params: {
    modelParams: ModelParamsType;
    batchParams: BatchParamsType;
    imgDimensionParams: ImgDimensionParamsType;
    guidanceParams: GuidanceParamsType;
    promptParams: PromptParamsType;
    samplingParams: SamplingParamsType;
    seedParams: SeedParamsType;
  };
  isLoading: boolean;
  taskId: string | null;
  checkedOutput: boolean;
  output: {
    processedImgsCnt: number;
    outputImgs: string[]; // api 수정되면 제거할 예정
    firstProcessedImg: string | null;
  };
}

const initialState: Txt2ImgState = {
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

const txt2ImgSlice = createSlice({
  name: 'txt2Img',
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

    setModelParams: (state, action: PayloadAction<string>) => {
      state.params.modelParams.model = action.payload;
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
  resetState
} = txt2ImgSlice.actions;

export default txt2ImgSlice.reducer;
