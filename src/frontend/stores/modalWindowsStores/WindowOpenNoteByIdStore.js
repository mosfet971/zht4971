import { makeAutoObservable } from "mobx";
import { modalWindowsManagerStore } from "../ModalWindowsManagerStore";
import { noteTabStore } from "../tabsStores/NoteTabStore";
import { tabsManagerStore } from "../TabsManagerStore";

class WindowOpenNoteByIdStore {
    constructor() {
        makeAutoObservable(this);
    }

    noteId = "";

    idInputOninputHandler = async (e) => {
        e.preventDefault();
        this.noteId = e.target.value;
    };

    submit = async () => {
        await modalWindowsManagerStore.close();
        await noteTabStore.openNote(this.noteId);
        
    };
    
    reset = async () => {
        this.noteId = "";
    };
    
}

export const windowOpenNoteByIdStore = new WindowOpenNoteByIdStore();