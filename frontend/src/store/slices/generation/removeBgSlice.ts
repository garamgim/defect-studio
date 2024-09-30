import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UploadImgParamsType } from '../../../types/generation';

interface RemoveBgState {
  gpuNum: number | null; // 지정안하면 settings의 기본 default number 사용
  params: {
    uploadImgParams: UploadImgParamsType;
  };
}
const initialState: RemoveBgState = {
  gpuNum: null,
  params: {
    uploadImgParams: {
      mode: 'manual',
      clipData: [],
      imageList: [],
      inputPath: '',
      outputPath: '',
      isZipDownload: false
    }
  }
};

const removeBgSlice = createSlice({
  name: 'removeBg',
  initialState,
  reducers: {
    setGpuNum: (state, action: PayloadAction<number | null>) => {
      state.gpuNum = action.payload;
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
    }
  }
});

export const { setGpuNum, setMode, setClipData, setImageList, setInputPath, setOutputPath, setIsZipDownload } =
  removeBgSlice.actions;

export default removeBgSlice.reducer;
