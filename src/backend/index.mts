import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import ZhtToolkit from './zht4971toolkit/index.mjs';
import { fileURLToPath } from 'url';
import contextMenu from 'electron-context-menu';
import * as url from 'url';
import { Worker } from 'worker_threads';

function runService(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, './service.mjs'), { workerData });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    })
  })
}


const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow: BrowserWindow;

contextMenu({
  showSaveImageAs: true,
  showInspectElement: false,
  showSearchWithGoogle: false,
  showSelectAll: false,
  showCopyLink: false
});

function createWindow() {
  mainWindow = new BrowserWindow({

    icon: path.join(__dirname + '../../../media/logo.ico'),
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

  if (!(__dirname.includes(".asar"))) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.show();

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../../frontend/dist/index.html'),
    protocol: "file:",
    slashes: true
  }));

  mainWindow.on('closed', () => {
    mainWindow = null;
    app.quit();
  });

  let zhtToolkit: ZhtToolkit;
  let zhtPassword = "";

  ipcMain.handle("login", async (e, password) => {
    try {
      zhtPassword = password;

      if (__dirname.includes(".asar")) {
        zhtToolkit = new ZhtToolkit(path.join(__dirname, "../../../../../../"), password);
      } else {
        zhtToolkit = new ZhtToolkit(path.join(__dirname, "../../../../"), password);
      }

      /*
      for (let i = 0; i < 100; i++) {
        zhtToolkit.filesTools.createFileObjectAndSave("saadad", Buffer.from("aas"), "text/plain")
      }
      */


      return true;
    } catch (error) {
      console.log(error);
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
    } catch (error) {
      return false;
    }

  });

  ipcMain.handle("createNewNoteAndGetId", async (e) => {
    return (zhtToolkit.notesTools.createBlankNoteObjectAndSave().id);
  });

  ipcMain.handle("collectGarbage", async (e) => {
    return await zhtToolkit.utils.collectGarbage();
  });

  ipcMain.handle("getDbStatus", async (e) => {
    return await zhtToolkit.utils.getDatabaseStatus();
  });

  ipcMain.handle("changePassword", async (e, args) => {
    let isOk = false;

    try {
      await zhtToolkit.utils.changePassword(args.oldPassword, args.newPassword);
      isOk = true;
    } catch (error) {
      isOk = false;
    }

    return isOk;
  });

  ipcMain.handle("getNoteObject", async (e, id) => {
    return await zhtToolkit.notesTools.get(id, false);
  });

  ipcMain.handle("getNoteObjectByUser", async (e, id) => {
    return await zhtToolkit.notesTools.get(id, true);
  });

  ipcMain.handle("saveNoteObject", async (e, noteObject) => {
    try {
      await zhtToolkit.notesTools.save(noteObject);
      return { isOk: true, error: null };
    } catch (error) {
      return { isOk: false, error: error };
    }
  });

  ipcMain.handle("saveTemplate", async (e, args) => {
    let templatesIds = await zhtToolkit.templatesTools.getListOfIds();
    let templatesNames = [];
    for (const i of templatesIds) {
      templatesNames.push((await zhtToolkit.templatesTools.get(i)).name);
    }

    if (templatesNames.includes(args.templateName)) {
      return false;
    } else {
      let templateObject = await zhtToolkit.templatesTools.createTemplateObject(args.templateText, args.templateName);
      zhtToolkit.templatesTools.save(templateObject);

      return true;
    }
  });

  ipcMain.handle("getTemplates", async (e, args) => {
    let templatesIds = await zhtToolkit.templatesTools.getListOfIds();
    let templates = [];
    for (const i of templatesIds) {
      templates.push(await zhtToolkit.templatesTools.get(i));
    }
    return templates;
  });

  ipcMain.handle("deleteTemplate", async (e, id) => {
    await zhtToolkit.templatesTools.delete(id);
  });

  ipcMain.handle("getNoteIdByNameOrAlias", async (e, params) => {
    const result = await runService({action: "getNoteIdByNameOrAlias", password: zhtPassword, params: {name: params.name, semanticDateNumber: params.semanticDateNumber}});
    return result;
  });

  ipcMain.handle("saveFile", async (e, params) => {
    let fileBuffer: any = params.fileBuffer;
    let fileType: any = params.fileType;
    let fileName: any = params.fileName;
    let fileId = await zhtToolkit.filesTools.createFileObjectAndSave(
      fileName,
      fileBuffer,
      fileType
    );
    return fileId;
  });

  ipcMain.handle("getFileZhtObject", async (e, params) => {
    try {
      return await zhtToolkit.filesTools.get(params.id);
    } catch (error) {
      return false;
    }
  });

  ipcMain.handle("getPrimaryList", async (e, params) => {
    const result = await runService({action: "getPrimaryList", password: zhtPassword, params});
    return result;
  });

  ipcMain.handle("getNotesList", async (e, params) => {
    const result = await runService({action: "getNotesList", password: zhtPassword, params});
    return result;
  });

  ipcMain.handle("search", async (e, params) => {
    const result = await runService({action: "search", password: zhtPassword, params});
    return result;
  });

  ipcMain.handle("getHubByName", async (e, hubName) => {
    let hubObject = await zhtToolkit.notesTools.getHub(hubName);
    return hubObject;
  });

};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
