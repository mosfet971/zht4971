/*
To index.js: 

  // поддерживается очень мало форматов видео, нужно конвертировать перед добавлением
  // ffmpeg -i [path_to_file] -c:v libvpx out.webm
  // :)

  ipcMain.handle("saveFile", async (e, params) => {
    let fileBuffer;
    let fileName;
    let fileType;

    fileBuffer = params.fileBuffer;
    fileType = params.fileType;
    fileName = params.fileName;
    let fileId = await zhtToolkit.filesTools.createFileObjectAndSave(
      fileName,
      fileBuffer,
      fileType
    );
    return fileId;
  });

  ipcMain.handle("getDemoNoteHtml", async (e, params) => {
    let listOfIds = zhtToolkit.filesTools.getListOfIds();

    let noteHtml = "";

    for (const i of listOfIds) {
      noteHtml += "![[" + String(i) + "]] " + "Lorem ipsum dolor sit amet ";
    }

    return noteHtml;
  });

  ipcMain.handle("getFileZhtObject", async (e, params) => {
    return await zhtToolkit.filesTools.get(params.id);
  });


to style:
  video {
    max-width: 70%; 
    max-height: 70vh;
    width: auto; 
    height: auto; 
    background-size: cover;
  }

  img {
    max-width: 70%; 
    max-height: 70vh;
    width: auto; 
    height: auto; 
    background-size: cover;
  }

*/


export let processText = async (textToProcess) => {
  if (!window.objUrls) {
    window.objUrls = [];
  }

  if(window.objUrls.length>0) {
    for (const i of window.objUrls) {
      URL.revokeObjectURL(i);
      window.objUrls = window.objUrls.filter((v)=>v!==i);
      console.log("revoke object url");
    }
  }
  let inpText = textToProcess;
  let outText = inpText;
  for (const j of inpText.matchAll(/!\!\[\[(.*?)\]\]/g)) {
    let i = j[0];
    let fileId = i.replaceAll(/\[|\]|\!|\!/g, "");

    let fileZhtObject = await ipcRenderer.invoke("getFileZhtObject", { id: fileId });
    let fileHtml = "";

    if (fileZhtObject == false) {
      fileHtml = "<br/>[Ошибка: файл не найден]<br/>";
      outText = outText.replace(i, fileHtml);
      continue;
    }

    let file = new File([new Blob([Buffer.from(fileZhtObject.fileBuffer)])], fileZhtObject.name, { type: fileZhtObject.mimeType });
    let objUrl = URL.createObjectURL(file);
    window.objUrls.push(objUrl);

    switch (file.type.split("/")[0]) {
      case "image":
        fileHtml = "<br/><img class='imgFileView' src='" + objUrl + "'></img><br/>" + "<a class='copyFileLink' download='" + file.name + "' href='" + objUrl + "'>Копировать файл: " + file.name + "</a><br/>";
        break;
      case "video":
        fileHtml = "<br/><video class='videoFileView' controls src='" + objUrl + "'></video><br/>" + "<a class='copyFileLink' download='" + file.name + "' href='" + objUrl + "'>Копировать файл: " + file.name + "</a><br/>";
        break;
      case "audio":
        fileHtml = "<br/><audio class='audioFileView' controls src='" + objUrl + "'></audio><br/>" + "<a class='copyFileLink' download='" + file.name + "' href='" + objUrl + "'>Копировать файл: " + file.name + "</a><br/>";
        break;
      default:
        fileHtml = "<br/><a class='copyFileLink' class='copyFileLink' download='" + file.name + "' href='" + objUrl + "'>Копировать файл: " + file.name + "</a><br/>";
        break;
    }
    outText = outText.replace(i, fileHtml);
  }
  return outText;
};

export let saveNewFile = async (file) => {
  let fileName = file.name;
  let fileType = file.type;
  let fileBuffer = Buffer.from(await file.arrayBuffer());
  let fileId = await ipcRenderer.invoke("saveFile", { fileName: fileName, fileType: fileType, fileBuffer: fileBuffer });
  return fileId;
};