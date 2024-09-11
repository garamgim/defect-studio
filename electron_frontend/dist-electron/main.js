import { app, BrowserWindow, ipcMain, Menu } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "fs";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    autoHideMenuBar: true,
    // 메뉴 바 숨기기
    webPreferences: {
      preload: path.join(MAIN_DIST, "preload.mjs"),
      // preload 경로 수정
      contextIsolation: true,
      // context isolation을 추가하여 보안 강화
      nodeIntegration: false
      // nodeIntegration을 꺼서 보안 강화
    }
  });
  const menuTemplate = [
    {
      label: "Edit",
      submenu: [
        {
          role: "zoomIn",
          accelerator: "CmdOrCtrl+="
          // 줌 인
        },
        {
          role: "zoomOut",
          accelerator: "CmdOrCtrl+-"
          // 줌 아웃
        }
      ]
    },
    {
      label: "View",
      submenu: [
        {
          role: "reload",
          accelerator: "CmdOrCtrl+R"
          // 새로고침
        },
        {
          role: "forceReload",
          accelerator: "CmdOrCtrl+Shift+R"
          // 강력 새로고침
        },
        {
          role: "toggleDevTools",
          accelerator: "CmdOrCtrl+Shift+I"
          // 개발자 도구 열기/닫기
        }
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "../dist/index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
ipcMain.handle("get-files-in-folder", async (_, folderPath) => {
  try {
    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return [".jpg", ".jpeg", ".png", ".gif"].includes(ext);
    });
    return imageFiles;
  } catch (error) {
    console.error("Error reading folder:", error);
    return [];
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
