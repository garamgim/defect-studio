import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OutputsInfoType, OutputInfo } from '../../../types/generation';

export interface OutputState {
  isLoading: boolean;
  isCheckedOutput: boolean;
  taskId: string | null;
  output: {
    imgsCnt: number;
    imgsUrl: string[];
  };
  allOutputs: OutputsInfoType;
  selectedImgs: string[];
  isAllSelected: boolean;
  isSidebarVisible: boolean;

  // generation탭에서 보여줄 수 있는 최대 이미지 개수(과거 누적 포함)
  MaxImgsNum: number;
}

export interface MultiTabOutputState {
  txt2Img: OutputState;
  img2Img: OutputState;
  inpainting: OutputState;
  removeBg: OutputState;
  cleanup: OutputState;
}

const initialState: MultiTabOutputState = {
  txt2Img: {
    isLoading: false,
    taskId: null,
    isCheckedOutput: true,
    output: {
      imgsCnt: 0,
      imgsUrl: []
    },
    allOutputs: {
      outputsCnt: 0,
      outputsInfo: []
    },
    selectedImgs: [],
    isAllSelected: false,
    isSidebarVisible: true,
    MaxImgsNum: 100
  },
  img2Img: {
    isLoading: false,
    taskId: null,
    isCheckedOutput: true,
    output: {
      imgsCnt: 0,
      imgsUrl: []
    },
    allOutputs: {
      outputsCnt: 0,
      outputsInfo: []
    },
    selectedImgs: [],
    isAllSelected: false,
    isSidebarVisible: true,
    MaxImgsNum: 100
  },
  inpainting: {
    isLoading: false,
    taskId: null,
    isCheckedOutput: true,
    output: {
      imgsCnt: 0,
      imgsUrl: []
    },
    allOutputs: {
      outputsCnt: 0,
      outputsInfo: []
    },
    selectedImgs: [],
    isAllSelected: false,
    isSidebarVisible: true,
    MaxImgsNum: 100
  },
  removeBg: {
    isLoading: false,
    taskId: null,
    isCheckedOutput: true,
    output: {
      imgsCnt: 0,
      imgsUrl: []
    },
    allOutputs: {
      outputsCnt: 0,
      outputsInfo: []
    },
    selectedImgs: [],
    isAllSelected: false,
    isSidebarVisible: true,
    MaxImgsNum: 100
  },
  cleanup: {
    isLoading: false,
    taskId: null,
    isCheckedOutput: true,
    output: {
      imgsCnt: 0,
      imgsUrl: []
    },
    allOutputs: {
      outputsCnt: 0,
      outputsInfo: []
    },
    selectedImgs: [],
    isAllSelected: false,
    isSidebarVisible: true,
    MaxImgsNum: 100
  }
};

const outputSlice = createSlice({
  name: 'output',
  initialState,
  reducers: {
    // 이미지 생성 체크를 위한 로딩
    setIsLoading: (state, action: PayloadAction<{ tab: keyof MultiTabOutputState; value: boolean }>) => {
      state[action.payload.tab].isLoading = action.payload.value;
    },
    // 이미지 생성 체크를 위해 받는 id값
    setTaskId: (state, action: PayloadAction<{ tab: keyof MultiTabOutputState; value: string | null }>) => {
      state[action.payload.tab].taskId = action.payload.value;
    },
    // 이미지 생성 후 생성된 이미지 확인 했는지 체크
    setIsCheckedOutput: (state, action: PayloadAction<{ tab: keyof MultiTabOutputState; value: boolean }>) => {
      state[action.payload.tab].isCheckedOutput = action.payload.value;
    },

    // 현재 Output
    setOutputImgsCnt: (state, action: PayloadAction<{ tab: keyof MultiTabOutputState; value: number }>) => {
      state[action.payload.tab].output.imgsCnt = action.payload.value;
    },
    setOutputImgsUrl: (state, action: PayloadAction<{ tab: keyof MultiTabOutputState; value: string[] }>) => {
      state[action.payload.tab].output.imgsUrl = action.payload.value;
    },

    // 전체 Outputs
    setAllOutputsInfo: (
      state,
      action: PayloadAction<{ tab: keyof MultiTabOutputState; outputsCnt: number; outputsInfo: OutputInfo[] }>
    ) => {
      state[action.payload.tab].allOutputs = {
        outputsCnt: action.payload.outputsCnt,
        outputsInfo: action.payload.outputsInfo
      };
    },

    // 전체 작업물 초기화 (과거 작업물을 초기화시키고, 사이드바도 보이게 변경)
    resetOutputs: (state, action: PayloadAction<keyof MultiTabOutputState>) => {
      state[action.payload].allOutputs = {
        outputsCnt: initialState[action.payload].allOutputs.outputsCnt,
        outputsInfo: initialState[action.payload].allOutputs.outputsInfo
      };
      state[action.payload].isSidebarVisible = initialState[action.payload].isSidebarVisible;
    },

    setSelectedImgs: (state, action: PayloadAction<{ tab: keyof MultiTabOutputState; value: string[] }>) => {
      state[action.payload.tab].selectedImgs = action.payload.value;
    },
    setIsAllSelected: (state, action: PayloadAction<{ tab: keyof MultiTabOutputState; value: boolean }>) => {
      state[action.payload.tab].isAllSelected = action.payload.value;
    },
    setIsSidebarVisible: (state, action: PayloadAction<{ tab: keyof MultiTabOutputState; value: boolean }>) => {
      state[action.payload.tab].isSidebarVisible = action.payload.value;
    },

    setMaxImgsNum: (state, action: PayloadAction<{ tab: keyof MultiTabOutputState; value: number }>) => {
      state[action.payload.tab].MaxImgsNum = action.payload.value;
    }
  }
});

export const {
  setIsLoading,
  setTaskId,
  setIsCheckedOutput,
  setOutputImgsCnt,
  setOutputImgsUrl,
  setAllOutputsInfo,
  resetOutputs,
  setSelectedImgs,
  setIsAllSelected,
  setIsSidebarVisible,
  setMaxImgsNum
} = outputSlice.actions;

export default outputSlice.reducer;
