import { makeAutoObservable, runInAction } from "mobx";
import { noteTextEditorStore } from "../noteComponentsStores/NoteTextEditorStore";

class WindowLoadTemplateStore {
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
                selectedTemplate = i;
            }
        }
        noteTextEditorStore.noteText = selectedTemplate.text;
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

export const windowLoadTemplateStore = new WindowLoadTemplateStore();