import { makeAutoObservable, runInAction } from "mobx";
import { noteTabStore } from "../tabsStores/NoteTabStore";

class WindowSaveTemplateStore {
    constructor() {
        makeAutoObservable(this);
    }

    status = "ready"; // ready, loading, finished, error

    templateName = "";

    reset = async () => {
        this.status = "ready";
        this.templateName = "";
    };

    templateNameInputHandler = async (e) => {
        this.templateName = e.target.value;
    };

    submit = async () => {
        runInAction(()=>{this.status = "loading";});
        let obj = JSON.parse(JSON.stringify(noteTabStore.noteObject));

        let templateText = JSON.stringify(obj);

        if(await ipcRenderer.invoke("saveTemplate", {
            templateName: this.templateName,
            templateText: templateText
        })) {
            runInAction(()=>{this.status = "finished";});
        } else {
            runInAction(()=>{this.status = "error";});
        }
        
    }
    
}

export const windowSaveTemplateStore = new WindowSaveTemplateStore();