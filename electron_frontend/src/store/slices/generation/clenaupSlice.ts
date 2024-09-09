// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface Cleauptate {
//   image: string | null;
//   objects: LineObject[];
// }

// const initialState: Cleauptate = {
//   image: null,
//   objects: [],
// };

// const cleanupSlice = createSlice({
//   name: 'inpainting',
//   initialState,
//   reducers: {
//     setImage(state, action: PayloadAction<string>) {
//       state.image = action.payload;
//     },
//     setObjects(state, action: PayloadAction<LineObject[]>) {
//       state.objects = action.payload;
//     },
//     resetState(state) {
//       state.image = null;
//       state.objects = [];
//     }
//   },
// });

// export const { setImage, setObjects, resetState } = cleanupSlice.actions;

// export default cleanupSlice.reducer;
