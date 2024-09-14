export {};

declare global {
  interface Window {
    electron: {
      selectFolder(): Promise<string | null>;
      getFilesInFolder: (folderPath: string) => Promise<FileData[]>;
    };
  }

  interface FileData {
    name: string;
    type: string;
    size: number;
    data: string; // base64
  }
}
