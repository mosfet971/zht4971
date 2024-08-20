import { makeAutoObservable, runInAction } from "mobx";
import { modalWindowsManagerStore } from "../ModalWindowsManagerStore";
import { tabsManagerStore } from "../TabsManagerStore";

class NoteTabStore {
    constructor() {
        makeAutoObservable(this);
    }

    status = "no"; // "no", "view", "edit", "loading"
    noteObject = {}; /*
    {
        id: id,
        name: "Новая запись " + id,
        aliasesList: [],
        isPrimary: false,
        tagsNotesListIds: [],
        lastGetTime: Date.now(),
        creationTime: Date.now(),
        editionTime: Date.now(),
        hasHistoricalDate: false,
        historicalDateNumber: 19700101, // 1970 01 01
        historicalDateAccuracyLevel_1_2_3: 0,
        sourceText: "Текст новой записи",
        taggedNotesIds: [],
        associatedNotesIds: []
    }
    */
    noteHtml = "";

    reset = async () => {
        this.noteObject = {};
        this.noteHtml = "";
        this.status = "no";
    };

    openNote = async (noteId) => {
        runInAction(() => { this.status = "loading"; });
        if (await ipcRenderer.invoke("checkNoteExist", noteId)) {
            this.noteObject = await ipcRenderer.invoke("getNoteObject", noteId);
            this.noteHtml = JSON.stringify(this.noteObject);
            this.status = "view";
        } else {
            modalWindowsManagerStore.open("WindowNoteNotExistError");
        }
    };

    delOpenedNote = async () => {
        await ipcRenderer.invoke("deleteNote", this.noteObject.id);
        this.reset();
    };

    createNewNoteAndOpenForWriting = async () => {
        let id = await ipcRenderer.invoke("createNewNoteAndGetId");
        await this.openNote(id);
        await this.startOpenedNoteWriting();
    };

    closeOpenedNote = async () => {
        this.reset();
    };

    startOpenedNoteWriting = async () => {
        this.status = "edit";
    };

    stopOpenedNoteWriting = async () => {
        this.openNote(this.noteObject.id);
    };

    copyOpenedNoteId = async () => {
        await navigator.clipboard.writeText(this.noteObject.id);
    };

    saveOpenedNote = async () => {
        runInAction(() => { this.status = "loading"; });

        let saveTryResult = await ipcRenderer.invoke("saveNoteObject", JSON.parse(JSON.stringify(this.noteObject)));
        if (saveTryResult.isOk == true) {
            this.openNote(this.noteObject.id);
        } else {
            alert(saveTryResult.error);
        }

    };

    tabScrollPos = {left: 0, top: 0};

    noteTextOnKeyDownEventHandler = (e) => {
        let tabElement = document.getElementById("readAndWrite");

        this.tabScrollPos.left = tabElement.scrollLeft;
        this.tabScrollPos.top = tabElement.scrollTop;
    };

    noteTextInputEventHandler = async (e) => {
        e.preventDefault();

        this.noteObject.sourceText = e.target.value;

        let tabElement = document.getElementById("readAndWrite");
        tabElement.scrollTo(this.tabScrollPos.left, this.tabScrollPos.top);
    };

    setNoteSourceText = async (text) => {
        this.noteObject.sourceText = text;
    };

}
//86b1f541-c454-4478-a185-a25031a8a1d2-1915d40dedf
export const noteTabStore = new NoteTabStore();