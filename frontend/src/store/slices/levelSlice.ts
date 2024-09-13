import { createSlice } from '@reduxjs/toolkit';

export type LevelState = 'Basic' | 'Advanced';

const initialState: LevelState = 'Basic';

const levelSlice = createSlice({
  name: 'level',
  initialState,
  reducers: {
    setLevel(_, action) {
      return action.payload;
    },
  },
});

export const { setLevel } = levelSlice.actions;
export default levelSlice.reducer;
