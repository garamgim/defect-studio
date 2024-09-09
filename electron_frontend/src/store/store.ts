import { configureStore } from '@reduxjs/toolkit';
import levelReducer from './slices/levelSlice';
import themeReducer from './slices/themeSlice';
<<<<<<< HEAD
import maskingReducer from './slices/generation/maskingSlice';
import txtToImgReducer from './slices/generation/txtToImgSlice';
import promptReducer from './slices/generation/promptSlice';
=======
import userInfoSlice from './slices/userInfoSlice';
>>>>>>> 7b0e653f9bc001457e5e9ffbbb5ae6e0007295f1

const store = configureStore({
  reducer: {
    level: levelReducer,
    theme: themeReducer,
<<<<<<< HEAD
    masking: maskingReducer,
    txtToImg: txtToImgReducer,
    prompt: promptReducer
=======
    userInfo: userInfoSlice
>>>>>>> 7b0e653f9bc001457e5e9ffbbb5ae6e0007295f1
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
