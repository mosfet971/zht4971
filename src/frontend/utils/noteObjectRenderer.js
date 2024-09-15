import markdownit from "markdown-it";
import * as filesFrontendUtils from "./filesFrontendUtils";
import * as includesTextProcessor from "./includesTextProcessor";
import * as linksTextProcessor from "./linksTextProcessor";

const md = markdownit({ html: true, linkify: true, typographer: true });

/*
    {
        id: id,
        name: "Новая запись " + id,
        aliasesList: [],
        isPrimary: false,
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



let renderNoteObjectParamsToHtml = async (noteObject) => {
    let out = "";

    out += "Название: " + noteObject.name + "<br/>";
    out += "Псевдонимы: " + noteObject.aliasesList.map((v) => '"' + v + '"').join(", ") + "<br/>";
    out += "Идентификатор: " + noteObject.id + "<br/>";
    out += "Избранная запись: " + (noteObject.isPrimary ? "Да" : "Нет") + "<br/>";
    out += "Время предидущего просмотра записи: " + (new Date(noteObject.lastGetTime)).toLocaleString() + "<br/>";
    out += "Время предидущего изменения записи: " + (new Date(noteObject.editionTime)).toLocaleString() + "<br/>";
    out += "Время создания записи: " + (new Date(noteObject.creationTime)).toLocaleString() + "<br/>";

    // TODO: ассоциации

    return out;
};

let renderNoteObjectTextToHtml = async (noteObject) => {
    let out = noteObject.sourceText;

    out = await filesFrontendUtils.processText(out);
    out = await includesTextProcessor.processText(out);
    out = await linksTextProcessor.processText(out);
    out = md.render(out);

    console.log(out);

    return out;
};

export let renderNoteObjectToHtml = async (noteObject) => {
    if (noteObject.sourceText) {
        console.log(noteObject);
        let paramBlock = await renderNoteObjectParamsToHtml(noteObject);
        let textBlock = await renderNoteObjectTextToHtml(noteObject);

        return ("<div class='renderedNoteContainer' style='word-break: break-all; max-width: 90%; margin: 1em; font-size: 110%;'>"
            + paramBlock + "<hr/>" + textBlock +
            "</div>");
    } else {
        return "";
    }
};