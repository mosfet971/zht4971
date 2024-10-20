import { makeAutoObservable, runInAction } from "mobx";
import { modalWindowsManagerStore } from "../ModalWindowsManagerStore";
import { tabsManagerStore } from "../TabsManagerStore";
import * as filesFrontendUtils from "../../utils/filesFrontendUtils";
import * as noteObjectRenderer from "../../utils/noteObjectRenderer";

class ListTabStore {
    constructor() {
        makeAutoObservable(this);
    }

    status = "loading"; // loading, ready 
    listOfNoteCardsHtml = "";
    sortMode = "byGetTime"; // byCreationTime, byGetTime, byEditionTime, byHistDate
    sortOrder = "bToA"; // aToB, bToA
    filtersList = [];

    reset = async () => {
        this.status = "loading";
        this.listOfNoteCardsHtml = "";
        this.sortMode = "byGetTime"; 
        this.sortOrder = "bToA";
        this.filtersList = [];
        await this.fetch();
    };

    fetch = async () => {
        await runInAction(()=>{this.status="loading"});


        console.log(this.filtersList)
        let objs = await ipcRenderer.invoke("getNotesList", {sortMode: this.sortMode, sortOrder: this.sortOrder, filtersList: [...this.filtersList]})

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

    openFiltersWindow = async () => {
        modalWindowsManagerStore.open("WindowFilterAdd");
    };

    addFilter = async (filterObject) => {
        this.filtersList.push(filterObject);
    }

    // TODO: delete filter from list
    // TODO: use filter list

}

export const listTabStore = new ListTabStore();