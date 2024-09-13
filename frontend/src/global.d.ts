// global.d.ts
export {};

declare global {
  interface Window {
    electron: {
      getFilesInFolder: (folderPath: string) => Promise<FileData[]>;
    };
  }

  interface FileData {
    name: string;
    type: string;
    size: number;
    data: string; // base64 encoded data
  }
}
