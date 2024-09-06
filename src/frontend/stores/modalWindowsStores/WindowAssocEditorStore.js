import { makeAutoObservable, runInAction } from "mobx";
import { noteTabStore } from "../tabsStores/NoteTabStore";
import { modalWindowsManagerStore } from "../ModalWindowsManagerStore";

class WindowAssocEditorStore {
    constructor() {
        makeAutoObservable(this);
    }

    status = "loading"; // loading, ready, finished
    isOpLoading = false;
    assocsNamesList = [];
    name = "";

    reset = async () => {
        runInAction(() => { this.status = "loading"; });

        this.isOpLoading = false;
        this.name = "";

        await this.fetchAssocs();

        runInAction(() => { this.status = "ready"; });
    };

    fetchAssocs = async () => {
        this.assocsNamesList = [];
        for (const id of noteTabStore.noteObject.associatedNotesIds) {
            let name = (await ipcRenderer.invoke("getNoteObject", id)).name;
            this.assocsNamesList.push(name);
        }
    };


    add = async () => {
        runInAction(() => { this.isOpLoading = true; });
        
        let resolvedId = await ipcRenderer.invoke("getNoteIdByNameOrAlias", this.name);

        if (resolvedId !== false) {
            if(!noteTabStore.noteObject.associatedNotesIds.includes(resolvedId)) {
                noteTabStore.noteObject.associatedNotesIds.push(resolvedId);
            }
        }

        await this.fetchAssocs();

        this.name = "";
        this.isOpLoading = false;
        document.getElementById("assocEditorInputName").focus();
    };

    remove = async () => {
        runInAction(() => { this.isOpLoading = true; });

        let resolvedId = await ipcRenderer.invoke("getNoteIdByNameOrAlias", this.name);

        if (resolvedId !== false) {
            noteTabStore.noteObject.associatedNotesIds = noteTabStore.noteObject.associatedNotesIds.filter((v)=>v!==resolvedId);
        }
        
        await this.fetchAssocs();

        this.name = "";
        this.isOpLoading = false;
        document.getElementById("assocEditorInputName").focus();
    };

    inputNameEventHandler = async (e) => {
        this.name = e.target.value;
    };
}

export const windowAssocEditorStore = new WindowAssocEditorStore();