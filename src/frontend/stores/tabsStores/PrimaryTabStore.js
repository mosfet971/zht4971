import { makeAutoObservable, runInAction } from "mobx";
import { modalWindowsManagerStore } from "../ModalWindowsManagerStore";
import { tabsManagerStore } from "../TabsManagerStore";
import * as filesFrontendUtils from "../../utils/filesFrontendUtils";
import * as noteObjectRenderer from "../../utils/noteObjectRenderer";

class PrimaryTabStore {
    constructor() {
        makeAutoObservable(this);
    }

    status = "loading"; // loading, ready 
    listOfNoteCardsHtml = "";
    sortMode = "byGetTime"; // byCreationTime, byGetTime, byEditionTime
    sortOrder = "bToA"; // aToB, bToA

    reset = async () => {
        this.status = "loading";
        this.listOfNoteCardsHtml = "";
        this.sortMode = "byGetTime"; 
        this.sortOrder = "bToA";
        await this.fetch();
    };

    fetch = async () => {
        await runInAction(()=>{this.status="loading"});


        let objs = await ipcRenderer.invoke("getPrimaryList", {sortMode: this.sortMode, sortOrder: this.sortOrder})

        this.listOfNoteCardsHtml = "";
        for (const i of objs) {
            this.listOfNoteCardsHtml += `<div style='justify-content: space-between;' class='bp5-card bp5-interactive' ` +  `onclick='window.openNoteById(`+ '"' + i.id + '"' + `)'>` + i.name + "<span class='bp5-icon-standard bp5-icon-document-open'></span></div>"
        }

        if (this.listOfNoteCardsHtml == "") {
            this.listOfNoteCardsHtml = "<h4 style='margin: 1em'>Ничего не найдено</h4>";
        }

        await runInAction(()=>{this.status="ready"});
    };

    sortModeChangeHandler = async (e) => {
        this.sortMode = e.target.value;
    };

    sortOrderChangeHandler = async (e) => {
        this.sortOrder = e.target.value;
    };

}

export const primaryTabStore = new PrimaryTabStore();