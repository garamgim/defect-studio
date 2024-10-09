import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  gpuNum: number;
  maxImgsNum: number;
}

const initialState: SettingsState = {
  gpuNum: 3,
  maxImgsNum: 100
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setGpuNum: (state, action: PayloadAction<number>) => {
      state.gpuNum = action.payload;
    },
    setMaxImgsNum: (state, action: PayloadAction<number>) => {
      state.maxImgsNum = action.payload;
    }
  }
});

export const { setGpuNum, setMaxImgsNum } = settingsSlice.actions;
export default settingsSlice.reducer;
