import { makeAutoObservable, runInAction } from "mobx";
import { modalWindowsManagerStore } from "../ModalWindowsManagerStore";
import { noteTabStore } from "../NoteTabStore";

class WindowGCStore {
    constructor() {
        makeAutoObservable(this);
    }

    status = "ready"; // ready, loading, finished
    
    start = async () => {
        runInAction(()=>{this.status = "loading";});
        await ipcRenderer.invoke("collectGarbage")
        runInAction(()=>{this.status = "finished";});
    };

    reset = async () => {
        this.status = "ready";
    }
    
}

export const windowGCStore = new WindowGCStore();