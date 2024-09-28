export {};

declare global {
  interface FileData {
    name: string;
    type: string;
    size: number;
    data: string; // base64
  }

  interface saveImgsResponse {
    success: boolean;
    error?: string;
  }

  interface ElectronAPI {
    saveImgs: (selectedImgs: string[], folderPath: string, format: string) => Promise<saveImgsResponse>;
    selectFolder: () => Promise<string | null>;
    getFilesInFolder: (folderPath: string) => Promise<FileData[]>;
  }

  interface Window {
    electron: ElectronAPI;
  }
}
