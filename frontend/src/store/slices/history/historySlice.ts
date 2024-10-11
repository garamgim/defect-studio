import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Folder {
  id: string;
  type: 'text_to_image' | 'image_to_image' | 'inpainting' | 'remove_background' | 'cleanup';
  prompt: string | null;
  firstImg: string;
}

interface FoldersState {
  folders: Folder[];
}

const initialState: FoldersState = {
  folders: []
};

const historySlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {
    setFolder: (state, action: PayloadAction<Folder>) => {
      const folder = action.payload;
      const existingFolderIndex = state.folders.findIndex((f) => f.id === folder.id);

      if (existingFolderIndex >= 0) {
        // 이미 존재하는 경우 제거
        state.folders = state.folders.filter((f) => f.id !== folder.id);
      } else {
        // 존재하지 않으면 추가
        state.folders.push(folder);
      }
    }
  }
});

export const { setFolder } = historySlice.actions;
export default historySlice.reducer;
