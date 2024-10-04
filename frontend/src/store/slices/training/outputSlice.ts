import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OutputState {
  isLoading: boolean;
  taskId: string | null;
  output: {
    global_step: number[];
    loss: number[];
    learning_rate: number[];
  };
}

const initialState: OutputState = {
  isLoading: false,
  taskId: null,
  output: {
    global_step: [],
    loss: [],
    learning_rate: []
  }
};

const outputSlice = createSlice({
  name: 'trainingOutput',
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setTaskId: (state, action: PayloadAction<string | null>) => {
      state.taskId = action.payload;
    },
    setOutput: (state, action: PayloadAction<{ global_step: number[]; loss: number[]; learning_rate: number[] }>) => {
      state.output = action.payload;
    },
    resetOutput: (state) => {
      state.output = { global_step: [], loss: [], learning_rate: [] };
      state.taskId = null;
      state.isLoading = false;
    }
  }
});

export const { setIsLoading, setTaskId, setOutput, resetOutput } = outputSlice.actions;

export default outputSlice.reducer;
