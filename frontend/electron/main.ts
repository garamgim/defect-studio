import { app, BrowserWindow, Menu, MenuItemConstructorOptions, ipcMain, dialog } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'fs';
import axios from 'axios';
import AdmZip from 'adm-zip';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '..');

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

let win: BrowserWindow | null;

// Electron 창을 생성하는 함수
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    autoHideMenuBar: true, // 메뉴 바 숨기기
    webPreferences: {
      preload: path.join(MAIN_DIST, 'preload.mjs'), // preload 경로 수정
      contextIsolation: true, // context isolation을 추가하여 보안 강화
      nodeIntegration: false // nodeIntegration을 꺼서 보안 강화
    }
  });

  // 메뉴 바를 숨긴 상태에서 단축키만 설정
  const menuTemplate: MenuItemConstructorOptions[] = [
    {
      label: 'Edit',
      submenu: [
        {
          role: 'zoomIn',
          accelerator: 'CmdOrCtrl+=' // 줌 인
        },
        {
          role: 'zoomOut',
          accelerator: 'CmdOrCtrl+-' // 줌 아웃
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          role: 'reload',
          accelerator: 'CmdOrCtrl+R' // 새로고침
        },
        {
          role: 'forceReload',
          accelerator: 'CmdOrCtrl+Shift+R' // 강력 새로고침
        },
        {
          role: 'toggleDevTools',
          accelerator: 'CmdOrCtrl+Shift+I' // 개발자 도구 열기/닫기
        }
      ]
    }
  ];

  // 메뉴 설정 및 숨기기
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, '../dist/index.html'));
  }
}

// 모든 창이 닫혔을 때 애플리케이션 종료
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'] // 폴더 선택 가능
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null; // 사용자가 폴더 선택을 취소했을 경우
  }

  return result.filePaths[0]; // 선택된 폴더의 경로 반환
});

ipcMain.handle('save-images', async (_, { images, folderPath, format }) => {
  try {
    // 폴더 경로가 유효한지 확인
    if (!fs.existsSync(folderPath)) {
      throw new Error('The folder does not exist.');
    }

    // 모든 이미지 다운로드 처리
    const downloadPromises = images.map((imageUrl: string, index: number) => {
      const filePath = path.join(folderPath, `image_${index + 1}.${format}`);
      return downloadImage(imageUrl, filePath);
    });

    await Promise.all(downloadPromises); // 병렬로 다운로드 처리

    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    } else {
      return { success: false, error: 'An unknown error occurred.' };
    }
  }
});

// 이미지 다운로드 및 저장 함수
async function downloadImage(url: string, filePath: string): Promise<void> {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

// 폴더 내 이미지 파일 가져오기
ipcMain.handle('get-files-in-folder', async (_, folderPath) => {
  try {
    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
    });

    const fileDataPromises = imageFiles.map((fileName) => {
      const filePath = path.join(folderPath, fileName);
      const fileBuffer = fs.readFileSync(filePath);
      const fileData = {
        name: fileName,
        type: 'image/' + path.extname(fileName).slice(1),
        size: fileBuffer.length,
        data: fileBuffer.toString('base64') // base64로 인코딩하여 전송
      };
      return fileData;
    });

    return fileDataPromises; // 파일 데이터 배열 반환
  } catch (error) {
    console.error('Error reading folder:', error);
    return [];
  }
});

ipcMain.handle('save-images-with-zip', async (_, { images, folderPath, format, isZipDownload }) => {
  try {
    // 폴더 경로가 유효한지 확인
    if (!fs.existsSync(folderPath)) {
      throw new Error('The folder does not exist.');
    }

    const downloadedFiles = [];

    // 이미지 다운로드 및 저장
    for (let i = 0; i < images.length; i++) {
      const imageUrl = images[i];
      const filePath = path.join(folderPath, `image_${i + 1}.${format}`);

      // 이미지 다운로드
      await downloadImage(imageUrl, filePath);
      downloadedFiles.push(filePath); // 다운로드된 파일 경로 저장
    }

    // ZIP으로 압축할 경우
    if (isZipDownload) {
      const zip = new AdmZip();
      downloadedFiles.forEach((file) => zip.addLocalFile(file)); // 다운로드된 파일을 ZIP에 추가

      const zipFilePath = path.join(folderPath, `images_${Date.now()}.zip`);
      zip.writeZip(zipFilePath); // ZIP 파일로 작성

      return { success: true, zipFilePath }; // ZIP 파일 경로 반환
    }

    return { success: true, filePaths: downloadedFiles }; // 개별 파일 경로 반환
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    } else {
      return { success: false, error: 'An unknown error occurred.' };
    }
  }
});
