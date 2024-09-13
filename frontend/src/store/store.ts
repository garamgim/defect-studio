import { configureStore } from '@reduxjs/toolkit';
import levelSlice from './slices/levelSlice';
import themeSlice from './slices/themeSlice';
import maskingSlice from './slices/generation/maskingSlice';
import txt2ImgSlice from './slices/generation/txt2ImgSlice';
import img2ImgSlice from './slices/generation/img2ImgSlice';
import inpaintingSlice from './slices/generation/inpaintingSlice';
import removeBgSlice from './slices/generation/removeBgSlice';
import cleanupSlice from './slices/generation/cleanupSlice';
import userInfoSlice from './slices/userInfoSlice';

const store = configureStore({
  reducer: {
    level: levelSlice,
    theme: themeSlice,
    masking: maskingSlice,
    txt2Img: txt2ImgSlice,
    img2Img: img2ImgSlice,
    inpainting: inpaintingSlice,
    removeBg: removeBgSlice,
    cleanup: cleanupSlice,
    userInfo: userInfoSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
