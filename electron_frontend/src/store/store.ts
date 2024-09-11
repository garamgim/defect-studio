import { configureStore } from '@reduxjs/toolkit';
import levelReducer from './slices/levelSlice';
import themeReducer from './slices/themeSlice';
import maskingReducer from './slices/generation/maskingSlice';
import txt2ImgReducer from './slices/generation/txt2ImgSlice';
import img2ImgReducer from './slices/generation/img2ImgSlice';
import InpaintingReducer from './slices/generation/inpaintingSlice';
import userInfoSlice from './slices/userInfoSlice';

const store = configureStore({
  reducer: {
    level: levelReducer,
    theme: themeReducer,
    masking: maskingReducer,
    txt2Img: txt2ImgReducer,
    img2Img: img2ImgReducer,
    inpainting: InpaintingReducer,
    userInfo: userInfoSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
