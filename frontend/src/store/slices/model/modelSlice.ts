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
      console.log('Task ID added:', state.taskId); // 상태가 제대로 변경되는지 확인
    },
    removeTaskId: (state, action: PayloadAction<string>) => {
      state.taskId = state.taskId.filter((id) => id !== action.payload);
      console.log('Task ID removed:', state.taskId); // 상태가 제대로 변경되는지 확인
    }
  }
});


export const { addTaskId, removeTaskId } = modelSlice.actions;

export default modelSlice.reducer;
