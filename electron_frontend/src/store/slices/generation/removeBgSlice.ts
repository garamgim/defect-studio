import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RemoveBgState {
  images: File[]; // 업로드할 이미지 파일들
  inputPath: string; // 이미지를 가져올 로컬 경로
  outputPath: string; // 이미지를 저장할 로컬 경로
  imageUrls: string[]; // 결과 이미지 URL 저장
}

const initialState: RemoveBgState = {
  images: [], // 기본값: 이미지 파일 없음
  inputPath: '', // 기본값: 경로 없음
  outputPath: '/output', // 기본값: 출력 경로
  imageUrls: [] // 결과 이미지 URL을 저장할 배열
};

const removeBgSlice = createSlice({
  name: 'removeBg',
  initialState,
  reducers: {
    setImages: (state, action: PayloadAction<File[]>) => {
      state.images = action.payload; // 업로드할 이미지 파일 설정
    },
    setInputPath: (state, action: PayloadAction<string>) => {
      state.inputPath = action.payload; // 이미지를 가져올 경로 설정
    },
    setOutputPath: (state, action: PayloadAction<string>) => {
      state.outputPath = action.payload; // 이미지를 저장할 경로 설정
    },
    setImageUrls: (state, action: PayloadAction<string[]>) => {
      state.imageUrls = action.payload; // 결과 이미지 URL을 설정
    }
  }
});

export const { setImages, setInputPath, setOutputPath, setImageUrls } = removeBgSlice.actions;

export default removeBgSlice.reducer;
