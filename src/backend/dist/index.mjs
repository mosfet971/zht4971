import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import ZhtToolkit from './zht4971toolkit/index.mjs';
import { fileURLToPath } from 'url';
import contextMenu from 'electron-context-menu';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let mainWindow;
contextMenu({
    showSaveImageAs: true,
    showInspectElement: false,
    showSearchWithGoogle: false,
    showSelectAll: false,
    showCopyLink: false
});
function createWindow() {
    mainWindow = new BrowserWindow({
        icon: __dirname + '/media/logo.ico',
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: 'rgba(37, 42, 49, 0)',
            symbolColor: 'rgb(45, 114, 210)',
            height: 25
        },
        autoHideMenuBar: true,
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
            //s enableRemoteModule: true, // turn off remote
            // preload: path.join(__dirname, 'preload.js')
        }
    });
    mainWindow.maximize();
    mainWindow.webContents.openDevTools();
    mainWindow.show();
    mainWindow.loadURL(path.join(__dirname, '../../frontend/dist/index.html'));
    mainWindow.on('closed', () => {
        mainWindow = null;
        app.quit();
    });
    let zhtToolkit;
    ipcMain.handle("login", async (e, password) => {
        try {
            zhtToolkit = new ZhtToolkit(path.join(__dirname, "../../../"), password);
            return true;
        }
        catch (error) {
            return false;
        }
    });
    ipcMain.handle("deleteNote", async (e, id) => {
        zhtToolkit.notesTools.delete(id);
    });
    ipcMain.handle("checkNoteExist", async (e, noteId) => {
        try {
            zhtToolkit.notesTools.get(noteId);
            return true;
        }
        catch (error) {
            return false;
        }
    });
    ipcMain.handle("createNewNoteAndGetId", async (e) => {
        return (zhtToolkit.notesTools.createBlankNoteObjectAndSave().id);
    });
}
;
app.on('ready', createWindow);
app.on('window-all-closed', () => {
    app.quit();
});
