import { makeAutoObservable, runInAction } from "mobx";
import { noteTabStore } from "../tabsStores/NoteTabStore";

class WindowAssocEditorStore {
    constructor() {
        makeAutoObservable(this);
    }

    status = "loading"; // loading, ready, finished
    assocsNamesAndIdsList = [];

    reset = async () => {
        runInAction(() => { this.status = "loading"; });
        this.assocsNamesAndIdsList = [];
        for (const id of noteTabStore.noteObject.associatedNotesIds) {
            let name = (await ipcRenderer.invoke("getNoteObject", id)).name;
            this.assocsNamesAndIdsList.push({ name, id })
        }
        await new Promise((resolve, reject) => {
            setTimeout(resolve, 3000);
        });
        runInAction(() => { this.status = "ready"; });
    };

    save = async () => {
        runInAction(() => { this.status = "loading"; });
        await noteTabStore.setNoteObjectAssocsList(this.assocsNamesAndIdsList);
        await new Promise((resolve, reject) => {
            setTimeout(resolve, 3000);
        });
        runInAction(() => { this.status = "finished"; });
    };

    add = async (name) => {
        runInAction(() => { this.status = "loading"; });
        runInAction(() => { this.status = "ready"; });
    };

    remove = async (id) => {
        runInAction(() => { this.status = "loading"; });
        runInAction(() => { this.status = "ready"; });
    };
}

export const windowAssocEditorStore = new WindowAssocEditorStore();