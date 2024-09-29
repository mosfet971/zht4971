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
        this.listOfNoteCardsHtml = JSON.stringify(objs);
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