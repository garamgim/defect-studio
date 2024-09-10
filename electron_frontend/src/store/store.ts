import { configureStore } from '@reduxjs/toolkit';
import levelReducer from './slices/levelSlice';
import themeReducer from './slices/themeSlice';
import maskingReducer from './slices/generation/maskingSlice';
import txtToImgReducer from './slices/generation/txtToImgSlice';
import imgToImgReducer from './slices/generation/imgToImgSlice';
import InpaintingReducer from './slices/generation/inpaintingSlice';
import userInfoSlice from './slices/userInfoSlice';


const store = configureStore({
  reducer: {
    level: levelReducer,
    theme: themeReducer,
    masking: maskingReducer,
    txtToImg: txtToImgReducer,
    imgToImg: imgToImgReducer,
    inpainting: InpaintingReducer,
    userInfo: userInfoSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
