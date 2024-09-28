import { configureStore } from '@reduxjs/toolkit';
import levelSlice from './slices/levelSlice';
import themeSlice from './slices/themeSlice';
import txt2ImgSlice from './slices/generation/txt2ImgSlice';
import img2ImgSlice from './slices/generation/img2ImgSlice';
import inpaintingSlice from './slices/generation/inpaintingSlice';
import removeBgSlice from './slices/generation/removeBgSlice';
import cleanupSlice from './slices/generation/cleanupSlice';
import txt2ImgOutputSlice from './slices/generatedOutput/txt2ImgOutputSlice';
import img2ImgOutputSlice from './slices/generatedOutput/img2ImgOutputSlice';
import inpaintingOutputSlice from './slices/generatedOutput/inpaintingOutputSlice';
import removeBgOutputSlice from './slices/generatedOutput/removeBgOutputSlice';
import cleanupOutputSlice from './slices/generatedOutput/cleanupOutputSlice';
import userInfoSlice from './slices/userInfoSlice';
import trainingSlice from './slices/training/trainingSlice';

const store = configureStore({
  reducer: {
    level: levelSlice,
    theme: themeSlice,
    txt2Img: txt2ImgSlice,
    img2Img: img2ImgSlice,
    inpainting: inpaintingSlice,
    removeBg: removeBgSlice,
    cleanup: cleanupSlice,
    txt2ImgOutput: txt2ImgOutputSlice,
    img2ImgOutput: img2ImgOutputSlice,
    inpaintingOutput: inpaintingOutputSlice,
    removeBgOutput: removeBgOutputSlice,
    cleanupOutput: cleanupOutputSlice,
    userInfo: userInfoSlice,
    training: trainingSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
