import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModelState {
  isLoading: boolean;
  taskId: string[];
}

const initialState: ModelState = {
  isLoading: false,
  taskId: []
};

const modelSlice = createSlice({
  name: 'modelOutput',
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    addTaskId: (state, action: PayloadAction<string>) => {
      state.taskId.push(action.payload);
    },
    removeTaskId: (state, action: PayloadAction<string>) => {
      state.taskId = state.taskId.filter((id) => id !== action.payload);
    }
  }
});

export const { setIsLoading, addTaskId, removeTaskId } = outputSlice.actions;

export default modelSlice.reducer;
