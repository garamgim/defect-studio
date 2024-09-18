import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  mode: 'light' | 'dark';
}

const getInitialTheme = (): 'light' | 'dark' => {
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
  return savedTheme || 'dark'; // 기본 다크 모드
};

// 페이지 로드 시 초기화
const initializeTheme = (theme: 'light' | 'dark') => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const initialState: ThemeState = {
  mode: getInitialTheme()
};

// 페이지 로드 시 초기 테마 반영
initializeTheme(initialState.mode);

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setDarkMode: (state) => {
      state.mode = 'dark';
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    },
    setLightMode: (state) => {
      state.mode = 'light';
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    },
    toggleMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      if (state.mode === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    },
    setMode: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.mode = action.payload;
      if (state.mode === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }
});

export const { setDarkMode, setLightMode, toggleMode, setMode } = themeSlice.actions;
export default themeSlice.reducer;
