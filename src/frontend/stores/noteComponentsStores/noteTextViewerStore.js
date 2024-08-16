import { makeAutoObservable, runInAction } from "mobx";
import { noteTabStore } from "../tabsStores/NoteTabStore";

class NoteTextViewerStore {
    constructor() {
        makeAutoObservable(this);
    }

    status = "loading"; // loading, ready
    noteText = "";

    reset = async () => {
        runInAction(()=>{this.status = "loading";});
        this.noteText = (await ipcRenderer.invoke("getNoteObject", noteTabStore.openedNoteId)).sourceText;
        runInAction(()=>{this.status = "ready";});
    };
}

export const noteTextViewerStore = new NoteTextViewerStore();