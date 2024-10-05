import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OutputState {
  isLoading: boolean;
  taskId: string[];
}

const initialState: OutputState = {
  isLoading: false,
  taskId: []
};

const outputSlice = createSlice({
  name: 'trainingOutput',
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

export default outputSlice.reducer;
