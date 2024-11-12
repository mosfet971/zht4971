import { makeAutoObservable, runInAction } from "mobx";
import { modalWindowsManagerStore } from "../ModalWindowsManagerStore";
import { tabsManagerStore } from "../TabsManagerStore";
import { noteTabStore } from "../tabsStores/NoteTabStore";

class WindowOpenNoteByNameStore {
    constructor() {
        makeAutoObservable(this);
    }

    noteName = "";
    status = "ready"; // [ready, loading]

    nameInputOninputHandler = async (e) => {
        e.preventDefault();
        this.noteName = e.target.value;
    };

    submit = async () => {
        runInAction(() => { this.status = "loading"; });

        await noteTabStore.openNoteByName(this.noteName, parseInt((new Date()).getFullYear().toString() + ((new Date()).getMonth() + 1).toString().padStart(2, "0") + (new Date()).getDate().toString().padStart(2, "0")));
    };

    reset = async () => {
        this.noteName = "";
        this.status = "ready";
    };

}

export const windowOpenNoteByNameStore = new WindowOpenNoteByNameStore();