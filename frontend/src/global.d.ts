export {};

declare global {
  interface FileData {
    name: string;
    type: string;
    size: number;
    data: string; // base64
  }

  interface SaveImagesResponse {
    success: boolean;
    error?: string;
  }

  interface ElectronAPI {
    saveImages: (selectedImages: string[], folderPath: string, format: string) => Promise<SaveImagesResponse>;
    selectFolder: () => Promise<string | null>;
    getFilesInFolder: (folderPath: string) => Promise<FileData[]>;
  }

  interface Window {
    electron: ElectronAPI;
  }
}
