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

        await noteTabStore.openNoteByName(this.noteName);
    };

    reset = async () => {
        this.noteName = "";
        this.status = "ready";
    };

}

export const windowOpenNoteByNameStore = new WindowOpenNoteByNameStore();