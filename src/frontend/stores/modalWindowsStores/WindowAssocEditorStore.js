import { makeAutoObservable, runInAction } from "mobx";
import { noteTabStore } from "../tabsStores/NoteTabStore";
import { modalWindowsManagerStore } from "../ModalWindowsManagerStore";

class WindowAssocEditorStore {
    constructor() {
        makeAutoObservable(this);
    }

    status = "loading"; // loading, ready, finished
    isOpLoading = false;
    tagsPreviewHtml = [];
    nameOfTargetNote = "";

    reset = async () => {
        runInAction(() => { this.status = "loading"; });

        this.isOpLoading = false;
        this.nameOfTargetNote = "";

        await this.fetchAssocs();

        runInAction(() => { this.status = "ready"; });
    };

    fetchAssocs = async () => {
        let out = "";

        let mapNoteTypeNumberToCssClassString = {
            0: "bp5-intent-primary",
            1: "bp5-intent-success",
            2: "bp5-intent-warning",
            3: "bp5-intent-danger"
        };

        let objs = [];
        for (const id of noteTabStore.noteObject.associatedNotesIds) {
            let obj = (await ipcRenderer.invoke("getNoteObject", id));
            objs.push(obj);
        }

        objs = objs.sort((a, b) => {
            return b.noteTypeNumber - a.noteTypeNumber;
        });

        out += "";
        for (const obj of objs) {
            let noteTypeNumberCssClassString = mapNoteTypeNumberToCssClassString[obj.noteTypeNumber];
            out += `<span style='margin-right: 0.6em; margin-bottom: 0.3em; margin-top: 0.3em;' class='` + noteTypeNumberCssClassString + ` bp5-tag'>` + obj.name + `</span>`;
        }

        if(out.trim().length == 0) {
            out += "<p>Еще не указано ни одной ассоциации для этой записи</p>";
        }

        this.tagsPreviewHtml = out;

    };


    add = async () => {
        runInAction(() => { this.isOpLoading = true; });

        let resolvedId = await ipcRenderer.invoke("getNoteIdByNameOrAlias", this.nameOfTargetNote);

        let list = noteTabStore.noteObject.associatedNotesIds;
        if (resolvedId !== false) {
            if (!list.includes(resolvedId)) {
                list.push(resolvedId);
                await noteTabStore.setNoteObjectAssocsList(list);
                await this.fetchAssocs();
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
            await noteTabStore.setNoteObjectAssocsList(noteTabStore.noteObject.associatedNotesIds.filter((v) => v !== resolvedId));
            await this.fetchAssocs();
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