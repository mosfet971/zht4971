import markdownit from "markdown-it";
import * as filesFrontendUtils from "./filesFrontendUtils";
import * as includesTextProcessor from "./includesTextProcessor";
import * as linksTextProcessor from "./linksTextProcessor";

const md = markdownit({ html: true, linkify: false, typographer: true });

/*
    {
        id: id,
        name: "Новая запись " + id,
        aliasesList: [],
        isPrimary: false,
        noteTypeNumber: 0,
        tagsNotesListIds: [],
        lastGetTime: Date.now(),
        creationTime: Date.now(),
        editionTime: Date.now(),
        hasHistoricalDate: false,
        historicalDateNumber: 19700101, // 1970 01 01
        historicalDateAccuracyLevel_1_2_3: 3,
        sourceText: "Текст новой записи",
        taggedNotesIds: [],
        associatedNotesIds: []
    }
    */



export let renderNoteObjectParamsToHtml = async (noteObject) => {
    let out = "";

    let mapNoteTypeNumberToCssClassString = {
        0: "bp5-intent-primary",
        1: "bp5-intent-success",
        2: "bp5-intent-warning",
        3: "bp5-intent-danger"
    };

    let mapNoteTypeNumberToInfoString = {
        0: "Обычная запись",
        1: "Запись-тег локального уровня",
        2: "Запись-тег среднего уровня",
        3: "Запись-тег глобального уровня"
    };

    out += "<h3>Название: " + noteObject.name + "</h3><hr/>";
    out += "Тип: " + mapNoteTypeNumberToInfoString[noteObject.noteTypeNumber] + "<br/>";
    out += "Псевдонимы: " + noteObject.aliasesList.map((v) => '"' + v + '"').join(", ") + "<br/>";
    out += "Идентификатор: " + noteObject.id + "<br/>";
    out += "Избранная запись: " + (noteObject.isPrimary ? "Да" : "Нет") + "<br/>";
    out += "Время создания записи: " + (new Date(noteObject.creationTime)).toLocaleString() + "<br/>";
    out += "Время предидущего изменения записи: " + (new Date(noteObject.editionTime)).toLocaleString() + "<br/>";
    
    let objs = [];
    for (const id of noteObject.associatedNotesIds) {
        let obj = (await ipcRenderer.invoke("getNoteObject", id));
        objs.push(obj);
    }

    objs = objs.sort((a,b)=>{
        return b.noteTypeNumber - a.noteTypeNumber;
    });
    
    out += "Ассоциации: ";
    for (const obj of objs) {
        let noteTypeNumberCssClassString = mapNoteTypeNumberToCssClassString[obj.noteTypeNumber];
        out += `<span style='margin-right: 0.6em; margin-bottom: 0.3em; margin-top: 0.3em;' onclick="window.openNoteByName('` + obj.name + `')" class='` + noteTypeNumberCssClassString + ` bp5-tag bp5-interactive'>` + obj.name + `</span>`;
    }

    return "<div style='width: fit-content;' class='bp5-card'>" + out + "</div>";
};

export let renderNoteObjectTextToHtml = async (noteObject) => {
    let out = noteObject.sourceText;

    out = await filesFrontendUtils.processText(out);
    out = await includesTextProcessor.processText(out);
    out = await linksTextProcessor.processText(out);
    out = md.render(out);

    console.log(out);

    return out;
};

export let renderNoteObjectToHtml = async (noteObject) => {
    if (!window.objUrls) {
        window.objUrls = [];
    }

    if (window.objUrls.length > 0) {
        for (const i of window.objUrls) {
            URL.revokeObjectURL(i);
            window.objUrls = window.objUrls.filter((v) => v !== i);
            console.log("revoke object url");
        }
    }

    if (noteObject.sourceText) {
        console.log(noteObject);
        let paramBlock = await renderNoteObjectParamsToHtml(noteObject);
        let textBlock = await renderNoteObjectTextToHtml(noteObject);

        return ("<div class='renderedNoteContainer' style='letter-spacing: .01em; word-break: normal; max-width: 90%; margin: 1em; font-size: 125%;'>"
            + paramBlock + "<br/>" + textBlock +
            "</div>");
    } else {
        return "";
    }
};