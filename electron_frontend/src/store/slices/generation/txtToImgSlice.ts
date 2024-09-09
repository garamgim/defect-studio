import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TxtToImgState {
  width: number;
  height: number;
  guidanceScale: number;
  samplingSteps: number;
  seed: string;
  isRandomSeed: boolean;
  model: string;
  samplingMethod: string;
  batchCount: string;
  batchSize: string;
}

const initialState: TxtToImgState = {
  width: 512,
  height: 512,
  guidanceScale: 7.5,
  samplingSteps: 50,
  seed: "-1",
  isRandomSeed: false,
  model: "Stable Diffusion v1-5",
  samplingMethod: "DPM++ 2M",
  batchCount: "1",
  batchSize: "1",
};

const txtToImgSlice = createSlice({
  name: "txtToImg",
  initialState,
  reducers: {
    setWidth: (state, action: PayloadAction<number>) => {
      state.width = action.payload;
    },
    setHeight: (state, action: PayloadAction<number>) => {
      state.height = action.payload;
    },
    setGuidanceScale: (state, action: PayloadAction<number>) => {
      state.guidanceScale = action.payload;
    },
    setSamplingSteps: (state, action: PayloadAction<number>) => {
      state.samplingSteps = action.payload;
    },
    setSeed: (state, action: PayloadAction<string>) => {
      state.seed = action.payload;
    },
    setIsRandomSeed: (state, action: PayloadAction<boolean>) => {
      state.isRandomSeed = action.payload;
    },
    setModel: (state, action: PayloadAction<string>) => {
      state.model = action.payload;
    },
    setSamplingMethod: (state, action: PayloadAction<string>) => {
      state.samplingMethod = action.payload;
    },
    setBatchCount: (state, action: PayloadAction<string>) => {
      state.batchCount = action.payload;
    },
    setBatchSize: (state, action: PayloadAction<string>) => {
      state.batchSize = action.payload;
    },
  },
});

export const {
  setWidth,
  setHeight,
  setGuidanceScale,
  setSamplingSteps,
  setSeed,
  setIsRandomSeed,
  setModel,
  setSamplingMethod,
  setBatchCount,
  setBatchSize,
} = txtToImgSlice.actions;

export default txtToImgSlice.reducer;
