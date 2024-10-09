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
    saveImgsWithZip(
      images: string[],
      folderPath: string,
      format: string,
      isZipDownload: boolean
    ): Promise<saveImgsResponse>;
    saveImgs: (selectedImgs: string[], folderPath: string, format: string) => Promise<saveImgsResponse>;
    selectFolder: () => Promise<string | null>;
    getFilesInFolder: (folderPath: string) => Promise<FileData[]>;
    showMessageBox: (options: { type: string; title: string; message: string }) => Promise<void>;
  }

  interface Window {
    electron: ElectronAPI;
  }
}
