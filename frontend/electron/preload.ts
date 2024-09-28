import { ipcRenderer, contextBridge } from 'electron';

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on(...args: Parameters<typeof ipcRenderer.on>) {
      const [channel, listener] = args;
      return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
    },
    off(...args: Parameters<typeof ipcRenderer.off>) {
      const [channel, ...omit] = args;
      return ipcRenderer.off(channel, ...omit);
    },
    send(...args: Parameters<typeof ipcRenderer.send>) {
      const [channel, ...omit] = args;
      return ipcRenderer.send(channel, ...omit);
    },
    invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
      const [channel, ...omit] = args;
      return ipcRenderer.invoke(channel, ...omit);
    }
  },

  // 파일 선택과 같은 사용자 정의 API
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  getFilesInFolder: (folderPath: string) => ipcRenderer.invoke('get-files-in-folder', folderPath),
  saveImgs: (images: string[], folderPath: string, format: string) =>
    ipcRenderer.invoke('save-images', { images, folderPath, format })
});
