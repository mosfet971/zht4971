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
        let resolvedId = await ipcRenderer.invoke("getNoteIdByNameOrAlias", this.noteName);
        if (resolvedId) {
            await noteTabStore.openNote(resolvedId);
            await tabsManagerStore.openTab("mainTabs", "readAndWrite");
            await modalWindowsManagerStore.close();
        } else {
            modalWindowsManagerStore.open("WindowError", "Ошибка: не удалось найти запись");
        }
        runInAction(() => { this.status = "ready"; });
    };
    
    reset = async () => {
        this.noteName = "";
        this.status = "ready";
    };
    
}

export const windowOpenNoteByNameStore = new WindowOpenNoteByNameStore();