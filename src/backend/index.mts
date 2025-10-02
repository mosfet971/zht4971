import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import ZhtToolkit from './zht4971toolkit/index.mjs';
import { fileURLToPath } from 'url';
import contextMenu from 'electron-context-menu';
import * as url from 'url';
//import { Worker } from 'worker_threads';
/*
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
*/

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
      contextIsolation: false,
      allowRunningInsecureContent: true
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

  ipcMain.handle("login", async (e, password) => {
    try {
      if (__dirname.includes(".asar")) {
        zhtToolkit = new ZhtToolkit(path.join(__dirname, "../../../../../../"), /*path.join(__dirname, "../../../../../model.json"),*/ password);
      } else {
        zhtToolkit = new ZhtToolkit(path.join(__dirname, "../../../../"), /*path.join(__dirname, "../../../model.json"),*/ password);
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
    //const result = await runService({action: "getNoteIdByNameOrAlias", password: zhtPassword, zhtToolkit: zhtToolkit, params: {name: params.name, semanticDateNumber: params.semanticDateNumber}});
    try {
      const result = await zhtToolkit.notesTools.getNoteIdByNameOrAlias(params.name, params.semanticDateNumber);
      return result;
    } catch (err) {
      return false;
    }
  });

  ipcMain.handle("saveFile", async (e, params) => {
    let fileBuffer: any = params.fileBuffer;
    let fileType: any = params.fileType;
    let fileName: any = params.fileName;
    let fileLastModified: any = params.fileLastModified;
    let fileId = await zhtToolkit.filesTools.createFileObjectAndSave(
      fileName,
      fileBuffer,
      fileType,
      fileLastModified
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
    //const result = await runService({action: "getPrimaryList", zhtToolkit: zhtToolkit, password: zhtPassword, params});
    let sortModeToParamNameMap = {
      "byCreationTime": "creationTime",
      "byGetTime": "lastGetTime",
      "byEditionTime": "editionTime",
      "byHistDate": "historicalDateNumber"
    };

    let paramName = sortModeToParamNameMap[params.sortMode];

    let isNeedInvertedOrderList = params.sortOrder == "bToA";

    let filters = await zhtToolkit.notesSearchTools.creteBlankFiltersList();
    filters = await zhtToolkit.notesSearchTools.addPramBoolFilter(filters, "isPrimary", true, false);
    let ids = await zhtToolkit.notesSearchTools.getListOfNotesIdsSortedByParamWithFilters(paramName, filters, isNeedInvertedOrderList);

    let objs = [];
    for (const id of ids) {
      let obj = await zhtToolkit.notesTools.get(id, false);
      objs.push({ name: obj.name, id: obj.id });
    }
    let result = objs;
    return result;
  });

  ipcMain.handle("getNotesList", async (e, params) => {
    //const result = await runService({action: "getNotesList", zhtToolkit: zhtToolkit, password: zhtPassword, params});
    return [];
  });

  ipcMain.handle("search", async (e, params) => {
    //const result = await runService({action: "search", zhtToolkit: zhtToolkit, password: zhtPassword, params});
    return [];
  });


  ipcMain.handle("getHubByName", async (e, hubName) => {
    let hubObject = await zhtToolkit.notesTools.getHub(hubName);
    return hubObject;
  });

  ipcMain.handle("getNotesIdsListByTagsStringsList", async (e, params) => {
    params = JSON.parse(params);
    let ids = (await zhtToolkit.zhtTagSearchTools.search(params.tagsStringsList)).map(v => v.docId);
    //console.log(ids);
    let objs = [];
    for (const id of ids) {
      let obj = await zhtToolkit.notesTools.get(id, false);
      objs.push({ name: obj.name, id: obj.id });
    }
    return objs;
  });

  ipcMain.handle("recalculateTags", async (e, params) => {
    await zhtToolkit.zhtTagSearchTools.recalculateAllTagsEmbeddings();
    return;
  });

};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
