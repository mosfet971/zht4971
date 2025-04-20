import { makeAutoObservable, runInAction } from "mobx";

class WindowRecalculateTagsStore {
    constructor() {
        makeAutoObservable(this);
    }

    status = "ready"; // ready, loading, finished
    
    start = async () => {
        runInAction(()=>{this.status = "loading";});
        await ipcRenderer.invoke("recalculateTags")
        runInAction(()=>{this.status = "finished";});
    };

    reset = async () => {
        this.status = "ready";
    }
    
}

export const windowRecalculateTagsStore = new WindowRecalculateTagsStore();