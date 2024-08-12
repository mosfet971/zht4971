import { makeAutoObservable, runInAction } from "mobx";

class WindowDBStatusStore {
    constructor() {
        makeAutoObservable(this);
    }

    status = "loading"; // loading, finished
    dbStatus = {notesNumber: 0, templatesNumber: 0, filesNumber: 0};

    reset = async () => {
        runInAction(()=>{this.status = "loading";});
        this.dbStatus = await ipcRenderer.invoke("getDbStatus");
        runInAction(()=>{this.status = "finished";});
    }
    
}

export const windowDBStatusStore = new WindowDBStatusStore();