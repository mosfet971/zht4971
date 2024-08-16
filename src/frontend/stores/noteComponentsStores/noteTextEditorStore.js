import { makeAutoObservable, runInAction } from "mobx";
import { noteTabStore } from "../tabsStores/NoteTabStore";

class NoteTextEditorStore {
    constructor() {
        makeAutoObservable(this);
    }

    status = "loading"; // loading, ready
    noteText = "";

    noteTextInputHandler = async (e) => {
        this.noteText = e.target.value;
    };

    reset = async () => {
        runInAction(()=>{this.status = "loading";});
        this.noteText = (await ipcRenderer.invoke("getNoteObject", noteTabStore.openedNoteId)).sourceText;
        runInAction(()=>{this.status = "ready";});
    };
    
    save = async () => {
        await ipcRenderer.invoke("setNoteSourceText", {id: noteTabStore.openedNoteId, sourceText: this.noteText});
    };
}

export const noteTextEditorStore = new NoteTextEditorStore();