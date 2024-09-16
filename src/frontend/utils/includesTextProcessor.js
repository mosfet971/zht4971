import { renderNoteObjectTextToHtml } from "./noteObjectRenderer";


export let processText = async (textToProcess) => {
    let inpText = textToProcess;
    let outText = inpText;
    let inclHtml;

    for (const j of inpText.matchAll(/!\[\[(.*?)\]\]/g)) {
        let i = j[0];
        let noteName = i.replaceAll(/\[|\]|\!/g, "");

        let noteId = await ipcRenderer.invoke("getNoteIdByNameOrAlias", noteName);
        
        if(noteId == false) {
            inclHtml = "[Ошибка: запись не найдена]";
            outText = outText.replace(i, inclHtml);
            continue;
        }
        
        let noteObject = await ipcRenderer.invoke("getNoteObject", noteId);

        inclHtml = await renderNoteObjectTextToHtml(noteObject);
        
        outText = outText.replace(i, inclHtml);
    }
    return outText;
};