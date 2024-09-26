import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UploadImgWithMaskingParamsType } from '../../../types/generation';

interface CleanupState {
  params: {
    uploadImgWithMaskingParams: UploadImgWithMaskingParamsType;
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

const initialState: CleanupState = {
  params: {
    uploadImgWithMaskingParams: {
      mode: 'manual',
      clipData: [],
      initImageList: [],
      maskImageList: [],
      combinedImg: null,
      initInputPath: '',
      maskInputPath: '',
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

const cleanupSlice = createSlice({
  name: 'cleanup',
  initialState,
  reducers: {
    // UploadImgWithMaskingParams는 자주 업데이트 될 수 있으므로 개별 처리
    setMode: (state, action: PayloadAction<'manual' | 'batch'>) => {
      state.params.uploadImgWithMaskingParams.mode = action.payload;
    },
    setInitImageList: (state, action: PayloadAction<string[]>) => {
      state.params.uploadImgWithMaskingParams.initImageList = action.payload;
    },
    setMaskImageList: (state, action: PayloadAction<string[]>) => {
      state.params.uploadImgWithMaskingParams.maskImageList = action.payload;
    },
    setMaskInputPath: (state, action: PayloadAction<string>) => {
      state.params.uploadImgWithMaskingParams.maskInputPath = action.payload;
    },
    setCombinedImg: (state, action: PayloadAction<string | null>) => {
      state.params.uploadImgWithMaskingParams.combinedImg = action.payload;
    },
    setInitInputPath: (state, action: PayloadAction<string>) => {
      state.params.uploadImgWithMaskingParams.initInputPath = action.payload;
    },
    setOutputPath: (state, action: PayloadAction<string>) => {
      state.params.uploadImgWithMaskingParams.outputPath = action.payload;
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
  setInitImageList,
  setMaskImageList,
  setMaskInputPath,
  setCombinedImg,
  setInitInputPath,
  setOutputPath,
  setIsLoading,
  setCheckedOutput,
  setTaskId,
  setProcessedImgsCnt,
  setFirstProcessedImg,
  setOutputImgs
} = cleanupSlice.actions;

export default cleanupSlice.reducer;
