import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UploadImgParamsType } from '../../../types/generation';

interface RemoveBgState {
  params: {
    uploadImgParams: UploadImgParamsType;
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
const initialState: RemoveBgState = {
  params: {
    uploadImgParams: {
      mode: 'manual',
      clipData: [],
      imageList: [],
      inputPath: '',
      outputPath: ''
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

const removeBgSlice = createSlice({
  name: 'removeBg',
  initialState,
  reducers: {
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
    }
  }
});

export const {
  setMode,
  setClipData,
  setImageList,
  setInputPath,
  setOutputPath,
  setIsLoading,
  setTaskId,
  setCheckedOutput,
  setProcessedImgsCnt,
  setFirstProcessedImg,
  setOutputImgs
} = removeBgSlice.actions;

export default removeBgSlice.reducer;
