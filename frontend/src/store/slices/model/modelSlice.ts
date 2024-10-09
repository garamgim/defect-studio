import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModelState {
  taskId: string[];
}

const initialState: ModelState = {
  taskId: []
};

const modelSlice = createSlice({
  name: 'modelOutput',
  initialState,
  reducers: {
    addTaskId: (state, action: PayloadAction<string>) => {
      state.taskId.push(action.payload);
    },
    removeTaskId: (state, action: PayloadAction<string>) => {
      state.taskId = state.taskId.filter((id) => id !== action.payload);
    }
  }
});

export const { addTaskId, removeTaskId } = modelSlice.actions;

export default modelSlice.reducer;
