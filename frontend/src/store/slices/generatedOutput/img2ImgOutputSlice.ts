import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OutputsInfoType, OutputInfo } from '../../../types/generation';

interface Img2ImgOutputState {
  isLoading: boolean;
  checkedOutput: boolean;
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

const initialState: Img2ImgOutputState = {
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

  selectedImgs: [],
  isAllSelected: false,
  isSidebarVisible: true,

  MaxImgsNum: 100
};

const img2ImgOutputSlice = createSlice({
  name: 'img2ImgOutput',
  initialState,
  reducers: {
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

    // 전체 작업물 초기화
    resetOutputs: (state) => {
      Object.assign(state.allOutputs, initialState.allOutputs);
    },

    setselectedImgs: (state, action: PayloadAction<string[]>) => {
      state.selectedImgs = action.payload;
    },
    setIsAllSelected: (state, action: PayloadAction<boolean>) => {
      state.isAllSelected = action.payload;
    },
    setIsSidebarVisible: (state, action: PayloadAction<boolean>) => {
      state.isSidebarVisible = action.payload;
    },

    setMaxImgsNum: (state, action: PayloadAction<number>) => {
      state.MaxImgsNum = action.payload;
    }
  }
});

export const {
  setIsLoading,
  setCheckedOutput,
  setTaskId,
  setOutputImgsCnt,
  setOutputImgsUrl,
  setAllOutputsInfo,
  resetOutputs,
  setIsAllSelected,
  setIsSidebarVisible,
  setselectedImgs,
  setMaxImgsNum
} = img2ImgOutputSlice.actions;

export default img2ImgOutputSlice.reducer;
