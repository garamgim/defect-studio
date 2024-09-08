import { configureStore } from '@reduxjs/toolkit';
import levelReducer from './slices/levelSlice';
import themeReducer from './slices/themeSlice';
import maskingReducer from './slices/generation/maskingSlice';
import txtToImgReducer from './slices/generation/txtToImgSlice';
import promptReducer from './slices/generation/promptSlice';

const store = configureStore({
  reducer: {
    level: levelReducer,
    theme: themeReducer,
    masking: maskingReducer,
    txtToImg: txtToImgReducer,
    prompt: promptReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
