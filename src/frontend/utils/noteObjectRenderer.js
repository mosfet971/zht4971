import markdownit from "markdown-it";
import * as filesFrontendUtils from "./filesFrontendUtils";
import * as includesTextProcessor from "./includesTextProcessor";
import * as linksTextProcessor from "./linksTextProcessor";
import * as hubsTextProcessor from "./hubsTextProcessor";
import * as diagramTextProcessor from "./diagramTextProcessor";

const md = markdownit({ html: true, linkify: false, typographer: true });


export let renderNoteObjectParamsToHtml = async (noteObject) => {
    let out = "";

    let mapNoteTypeNumberToCssClassString = {
        0: "bp5-intent-primary",
        1: "bp5-intent-success",
        2: "bp5-intent-warning",
        3: "bp5-intent-danger",
        4: "bp5-intent-primary",
        5: "bp5-intent-success",
        6: "bp5-intent-warning",
        7: "bp5-intent-danger",
        8: "bp5-intent-primary",
        9: "bp5-intent-success",
        10: "bp5-intent-warning",
        11: "bp5-intent-danger"
    };

    let mapHistoricalDateAccuracyLevelNumberToInfoString = {
        0: "Нет",
        1: "Низкая",
        2: "Средняя",
        3: "Максимальная"
    };


    out += "<h3>Название: " + noteObject.name + "</h3><hr/>";
    out += "Псевдонимы: " + noteObject.aliasesList.map((v) => '"' + v + '"').join(", ") + "<br/>";
    out += "Идентификатор: " + noteObject.id + "<br/>";
    //if (noteObject.hasHistoricalDate) {
    //    out += "Точность семантической даты: " + mapHistoricalDateAccuracyLevelNumberToInfoString[noteObject.historicalDateAccuracyLevel_1_2_3] + "<br/>";
    //}
    out += "Избранная запись: " + (noteObject.isPrimary ? "Да" : "Нет") + "<br/>";
    out += "Время создания записи: " + (new Date(noteObject.creationTime)).toLocaleString("ru-RU") + "<br/>";
    out += "Теги: " + noteObject.tagsStrings.map((v) => '"' + v + '"').join(", ") + "<br/>";

    out += "<span style='display: inline-flex; justify-items: center; flex-direction: row; margin: 0;'>Время предыдущего изменения записи:&nbsp;<p style='margin: 0;'>" + (new Date(noteObject.editionTime)).toLocaleString("ru-RU") + "</p></span><br/>";
    out += "<span style='display: inline-flex; justify-items: center; flex-direction: row; margin: 0;'>Предыдущее изменение было, дней назад:&nbsp;<p style='margin: 0;'>" + Math.floor(((Date.now() / 1000) - (noteObject.editionTime / 1000)) / 60 / 60 / 24).toString() + "</p></span><br/>";

    /*
    let objs = [];
    for (const id of noteObject.associatedNotesIds) {
        let obj = (await ipcRenderer.invoke("getNoteObject", id));
        objs.push(obj);
    }

    objs = objs.sort((a, b) => {
        return b.noteTypeNumber - a.noteTypeNumber;
    });

    out += "Ассоциации: ";
    for (const obj of objs) {
        let noteTypeNumberCssClassString = mapNoteTypeNumberToCssClassString[obj.noteTypeNumber];
        out += `<span style='margin-right: 0.6em; margin-bottom: 0.3em; margin-top: 0.3em;' onclick="window.openNoteById('` + obj.id + `')" class='` + noteTypeNumberCssClassString + ` bp5-tag bp5-interactive'>` + obj.name + `</span>`;
    }
    */

    return "<div style='width: fit-content; max-width: 60vw; margin-left: -2em;' class='bp5-card'>" + out + "</div>";
};

export let renderNoteObjectTextToHtml = async (noteObject) => {
    let out = noteObject.sourceText;

    let isHubNote = false;
    let hubName = "";

    isHubNote = !(await ipcRenderer.invoke("getHubByName", noteObject.name.trim()) == "err");
    hubName = isHubNote ? noteObject.name.trim() : "";

    for (const i of noteObject.aliasesList) {
        isHubNote = !(await ipcRenderer.invoke("getHubByName", i.trim()) == "err");
        if(isHubNote) {
            hubName = i.trim();
            break;
        }
    }

    if(isHubNote) {
        out += "<br/>{{" + hubName + "}}";
    }

    out = await diagramTextProcessor.processText(out);
    out = await filesFrontendUtils.processText(out, noteObject.historicalDateNumber);
    out = await includesTextProcessor.processText(out, noteObject.historicalDateNumber);
    out = await linksTextProcessor.processText(out, noteObject.historicalDateNumber);
    out = await hubsTextProcessor.processText(out, noteObject.historicalDateNumber);
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

        return ("<div class='renderedNoteContainer' style='letter-spacing: .01em; word-break: normal; max-width: 90%; margin-left: 3em; margin-right: 1em; margin-top: 1em; margin-bottom: 1em; font-size: 125%;'>"
            + paramBlock + "<hr style='margin-top: 1em; margin-bottom: 1em; width: 110vw; margin-left: -5em;'/>" + textBlock +
            "</div>");
    } else {
        return "";
    }
};