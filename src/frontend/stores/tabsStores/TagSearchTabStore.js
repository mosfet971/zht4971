import { makeAutoObservable, runInAction } from "mobx";
import { modalWindowsManagerStore } from "../ModalWindowsManagerStore";
import { tabsManagerStore } from "../TabsManagerStore";
import * as filesFrontendUtils from "../../utils/filesFrontendUtils";
import * as noteObjectRenderer from "../../utils/noteObjectRenderer";


class TagSearchTabStore {
    constructor() {
        makeAutoObservable(this);
    }

    status = "loading"; // loading, ready 
    listOfNoteCardsHtml = "";
    tagsStrings = [];
    isPrefix = false;

    reset = async () => {
        this.status = "ready";
        this.listOfNoteCardsHtml = "";
        this.tagsStrings = [];
        this.fetch();
    };

    fetch = async () => {
        await runInAction(() => { this.status = "loading" });

        let objs = await ipcRenderer.invoke("getNotesIdsListByTagsStringsList", JSON.stringify({ tagsStringsList: this.tagsStrings }));
        console.log("objs", objs);
        this.listOfNoteCardsHtml = "";
        for (const i of objs) {
            this.listOfNoteCardsHtml += `<div style='justify-content: space-between;' class='bp5-card bp5-interactive' ` + `onclick='window.openNoteById(` + '"' + i.id + '"' + `)'>` + i.name + "<span class='bp5-icon-standard bp5-icon-document-open'></span></div>"
        }

        if (this.listOfNoteCardsHtml == "") {
            this.listOfNoteCardsHtml = "<h4 style='margin: 1em'>Ничего не найдено</h4>";
        }

        await runInAction(() => { this.status = "ready" });
    };

    noteTagsStringsChangeEventHandler = async (newList) => {
        this.tagsStrings = newList;
        await this.fetch();
        (document.getElementsByClassName("tagSearchInput")[0]).focus();
    };


}

export const tagSearchTabStore = new TagSearchTabStore();