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
    sortMode = "byCreationTime"; // byCreationTime, byGetTime, byEditionTime
    sortOrder = "aToB";

    reset = async () => {
        this.status = "loading";
        this.listOfNoteCardsHtml = "";
        this.sortMode = "byCreationTime"; 
        this.sortOrder = "aToB";
        await this.fetch();
    };

    fetch = async () => {
        await runInAction(()=>{this.status="loading"});
        this.listOfNoteCardsHtml = "cards: list of bibas " + this.sortMode + " " + this.sortOrder;
        await runInAction(()=>{this.status="ready"});
    };

    sortModeChangeHandler = async (e) => {
        this.sortMode = e.target.value;
        await this.fetch();
    };

    sortOrderChangeHandler = async (e) => {
        this.sortOrder = e.target.value;
        await this.fetch();
    };

}

export const primaryTabStore = new PrimaryTabStore();