import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PromptState {
  clipData: string;
  prompt: string;
  negativePrompt: string;
  isNegativePrompt: boolean;
}

const initialState: PromptState = {
  clipData: '',
  prompt: '',
  negativePrompt: '',
  isNegativePrompt: false
};

const promptSlice = createSlice({
  name: 'prompt',
  initialState,
  reducers: {
    setPrompt: (state, action: PayloadAction<string>) => {
      state.prompt = action.payload;
    },
    setNegativePrompt: (state, action: PayloadAction<string>) => {
      state.negativePrompt = action.payload;
    },
    appendToPrompt: (state, action: PayloadAction<string>) => {
      state.prompt = state.prompt ? `${state.prompt}, ${action.payload}` : action.payload;
    },
    setIsNegativePrompt: (state, action: PayloadAction<boolean>) => {
      state.isNegativePrompt = action.payload; // negativePrompt 활성화 상태 설정
      if (!state.isNegativePrompt) {
        state.negativePrompt = ''; // 비활성화되면 negativePrompt 초기화
      }
    },
    // 상태를 초기값으로 리셋하는 액션 추가
    resetPromptState: () => initialState,
  }
});

export const { setPrompt, setNegativePrompt, appendToPrompt, setIsNegativePrompt, resetPromptState } = promptSlice.actions;

export default promptSlice.reducer;
