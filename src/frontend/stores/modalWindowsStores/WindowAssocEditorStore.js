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
    nameOfTargetNote = "";

    reset = async () => {
        runInAction(() => { this.status = "loading"; });

        this.isOpLoading = false;
        this.nameOfTargetNote = "";

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

        let resolvedId = await ipcRenderer.invoke("getNoteIdByNameOrAlias", this.nameOfTargetNote);

        let list = noteTabStore.noteObject.associatedNotesIds;
        if (resolvedId !== false) {
            if (!list.includes(resolvedId)) {
                list.push(resolvedId);
                noteTabStore.setNoteObjectAssocsList(list);
                let name = (await ipcRenderer.invoke("getNoteObject", resolvedId)).name;
                this.assocsNamesList.push(name);
            }
        }

        //await this.fetchAssocs();

        this.nameOfTargetNote = "";
        this.isOpLoading = false;
        document.getElementById("assocEditorInputName").focus();
    };

    remove = async () => {
        runInAction(() => { this.isOpLoading = true; });

        let resolvedId = await ipcRenderer.invoke("getNoteIdByNameOrAlias", this.nameOfTargetNote);

        if (resolvedId !== false) {
            noteTabStore.setNoteObjectAssocsList(noteTabStore.noteObject.associatedNotesIds.filter((v) => v !== resolvedId));
            let name = (await ipcRenderer.invoke("getNoteObject", resolvedId)).name;
            this.assocsNamesList = this.assocsNamesList.filter((v) => v !== name);
        }

        //await this.fetchAssocs();

        this.nameOfTargetNote = "";
        this.isOpLoading = false;
        document.getElementById("assocEditorInputName").scrollIntoView(false);
        document.getElementById("assocEditorInputName").focus();
    };

    inputNameEventHandler = async (e) => {
        this.nameOfTargetNote = e.target.value;
    };
}

export const windowAssocEditorStore = new WindowAssocEditorStore();