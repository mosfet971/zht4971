import { makeAutoObservable, runInAction } from "mobx";
import { noteTabStore } from "../tabsStores/NoteTabStore";

class WindowTemplatesStore {
    constructor() {
        makeAutoObservable(this);
    }

    status = "loading"; // loading, ready, finished
    templates = [];

    reset = async () => {
        runInAction(()=>{this.status = "loading";});
        this.templates = await ipcRenderer.invoke("getTemplates");
        runInAction(()=>{this.status = "ready";});
    };

    submit = async (templateId) => {
        runInAction(()=>{this.status = "loading";});
        let selectedTemplate;
        for (const i of this.templates) {
            if(i.id == templateId) {
                selectedTemplate = JSON.parse(JSON.stringify(i));
            }
        }
        
        let noteObject = JSON.parse(selectedTemplate.text);
        noteObject.id = noteTabStore.noteObject;
        noteObject.name = noteTabStore.name;
        noteObject.aliasesList = noteObject.aliasesList;
        selectedTemplate.text = JSON.stringify(noteObject)

        await noteTabStore.setNoteObject(JSON.parse(selectedTemplate.text));
        runInAction(()=>{this.status = "finished";});
    };

    deleteTemplate = async (templateId) => {
        runInAction(()=>{this.status = "loading";});
        let selectedTemplate;
        for (const i of this.templates) {
            if(i.id == templateId) {
                selectedTemplate = i;
            }
        }
        await ipcRenderer.invoke("deleteTemplate", selectedTemplate.id);
        this.reset();
    };
    
}

export const windowTemplatesStore = new WindowTemplatesStore();