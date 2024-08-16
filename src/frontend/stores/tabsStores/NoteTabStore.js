import { makeAutoObservable, runInAction } from "mobx";
import { modalWindowsManagerStore } from "../ModalWindowsManagerStore";
import { tabsManagerStore } from "../TabsManagerStore";
import { noteTextEditorStore } from "../noteComponentsStores/noteTextEditorStore";

class NoteTabStore {
    constructor() {
        makeAutoObservable(this);
    }

    status = "no"; // "no", "view", "edit", "loading"
    openedNoteId = "-";

    openNote = async (noteId) => {
        if (await ipcRenderer.invoke("checkNoteExist", noteId)) {
            this.openedNoteId = noteId;
            this.status = "view";
            await tabsManagerStore.openTab("mainTabs", "readAndWrite");
        } else {
            modalWindowsManagerStore.open("WindowNoteNotExistError");
        }
    };

    delOpenedNote = async () => {
        await ipcRenderer.invoke("deleteNote", this.openedNoteId);
        this.openedNoteId = "-";
        this.status = "no";
    };

    createNewNoteAndOpenForWriting = async () => {
        await tabsManagerStore.openTab("mainTabs", "readAndWrite");
        this.openedNoteId = await ipcRenderer.invoke("createNewNoteAndGetId");
        this.status = "edit";
    };

    closeOpenedNote = async () => {
        this.openedNoteId = "-";
        this.status = "no";
    };

    startOpenedNoteWriting = async () => {
        this.status = "edit";
    };

    stopOpenedNoteWriting = async () => {
        this.status = "view";
    };

    copyOpenedNoteId = async () => {
        await navigator.clipboard.writeText(this.openedNoteId);
    };

    save = async () => {
        runInAction(()=>{this.status = "loading";});
        await new Promise((resolve, reject) => {
            setTimeout(resolve, 3000);
        });
        await noteTextEditorStore.save();
        runInAction(()=>{this.status = "view";});
    };

}
//86b1f541-c454-4478-a185-a25031a8a1d2-1915d40dedf
export const noteTabStore = new NoteTabStore();