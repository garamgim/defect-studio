import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ModelParamsType,
  BatchParamsType,
  ImgDimensionParamsType,
  GuidanceParamsType,
  PromptParamsType,
  SamplingParamsType,
  SeedParamsType,
  OutputsInfoType,
  OutputInfo
} from '../../../types/generation';

export interface Txt2ImgState {
  gpuNum: number | null; // 지정안하면 settings의 기본 default number 사용
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
  checkedOutput: boolean;
  taskId: string | null;
  output: {
    imgsCnt: number;
    imgsUrl: string[];
  };
  allOutputs: OutputsInfoType;

  selectedImages: string[];
  allSelected: boolean;
  isSidebarVisible: boolean;
}

const initialState: Txt2ImgState = {
  gpuNum: null,
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
    imgsCnt: 0,
    imgsUrl: []
  },
  allOutputs: {
    outputsCnt: 0,
    outputsInfo: []
  },

  selectedImages: [],
  allSelected: false,
  isSidebarVisible: false
};

const txt2ImgSlice = createSlice({
  name: 'txt2Img',
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

    // 현재 Output
    setOutputImgsCnt: (state, action: PayloadAction<number>) => {
      state.output.imgsCnt = action.payload;
    },
    setOutputImgsUrl: (state, action: PayloadAction<string[]>) => {
      state.output.imgsUrl = action.payload;
    },

    // 전체 Outputs
    setAllOutputsInfo: (state, action: PayloadAction<{ outputsCnt: number; outputsInfo: OutputInfo[] }>) => {
      state.allOutputs = action.payload;
    },

    // params 초기화
    resetParams: (state) => {
      Object.assign(state.params, initialState.params);
    },
    // 전체 작업물 초기화
    resetOutputs: (state) => {
      Object.assign(state.allOutputs, initialState.allOutputs);
    },

    setSelectedImages: (state, action: PayloadAction<string[]>) => {
      state.selectedImages = action.payload;
    },
    setAllSelected: (state, action: PayloadAction<boolean>) => {
      state.allSelected = action.payload;
    },
    setIsSidebarVisible: (state, action: PayloadAction<boolean>) => {
      state.isSidebarVisible = action.payload;
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
  setIsLoading,
  setTaskId,
  setCheckedOutput,
  setOutputImgsCnt,
  setOutputImgsUrl,
  setAllOutputsInfo,
  resetParams,
  resetOutputs,
  setAllSelected,
  setIsSidebarVisible,
  setSelectedImages
} = txt2ImgSlice.actions;

export default txt2ImgSlice.reducer;
