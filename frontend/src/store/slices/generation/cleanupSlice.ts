import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UploadImgWithMaskingParamsType } from '../../../types/generation';

interface CleanupState {
  gpuNum: number | null; // 지정안하면 settings의 기본 default number 사용
  params: {
    uploadImgWithMaskingParams: UploadImgWithMaskingParamsType;
  };
}

const initialState: CleanupState = {
  gpuNum: null,
  params: {
    uploadImgWithMaskingParams: {
      mode: 'manual',
      clipData: [],
      initImageList: [],
      maskImageList: [],
      combinedImg: null,
      initInputPath: '',
      maskInputPath: '',
      outputPath: '',
      isZipDownload: false
    }
  }
};

const cleanupSlice = createSlice({
  name: 'cleanup',
  initialState,
  reducers: {
    setGpuNum: (state, action: PayloadAction<number | null>) => {
      state.gpuNum = action.payload;
    },

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
    setIsZipDownload: (state, action: PayloadAction<boolean>) => {
      state.params.uploadImgWithMaskingParams.isZipDownload = action.payload;
    }
  }
});
export const {
  setGpuNum,
  setMode,
  setInitImageList,
  setMaskImageList,
  setMaskInputPath,
  setCombinedImg,
  setInitInputPath,
  setOutputPath,
  setIsZipDownload
} = cleanupSlice.actions;

export default cleanupSlice.reducer;
