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

    historyStack = [];

    closeNote = async () => {
        this.noteObject = {};
        this.noteHtml = "";
        this.status = "no";
        this.historyStack = [];
    };

    openNote = async (noteId) => {
        runInAction(() => { this.status = "loading"; });
        if (await ipcRenderer.invoke("checkNoteExist", noteId)) {
            this.noteObject = await ipcRenderer.invoke("getNoteObject", noteId);
            this.noteHtml = JSON.stringify(this.noteObject);
            this.status = "view";
 
            if(this.historyStack[this.historyStack.length - 1] !== noteId) {
                this.historyStack.push(noteId);
            }
        } else {
            await modalWindowsManagerStore.open("WindowNoteNotExistError");
            await this.closeNote();
        }

        //console.log(this.historyStack);
    };

    openPrevNote = async () => {
        if (this.historyStack.length < 2) {
            return;
        } else {
            this.historyStack.pop();
            await this.openNote(this.historyStack[this.historyStack.length-1]);
            return;
        }
    };

    delOpenedNote = async () => {
        await ipcRenderer.invoke("deleteNote", this.noteObject.id);
        await this.closeNote();
    };

    createNewNoteAndOpenForWriting = async () => {
        let id = await ipcRenderer.invoke("createNewNoteAndGetId");
        await this.openNote(id);
        await this.startOpenedNoteWriting();
    };

    startOpenedNoteWriting = async () => {
        this.status = "edit";
    };

    stopOpenedNoteWriting = async () => {
        await this.openNote(this.noteObject.id);
    };

    copyOpenedNoteId = async () => {
        await navigator.clipboard.writeText(this.noteObject.id);
    };

    saveOpenedNote = async () => {
        runInAction(() => { this.status = "loading"; });

        let saveTryResult = await ipcRenderer.invoke("saveNoteObject", JSON.parse(JSON.stringify(this.noteObject)));
        if (saveTryResult.isOk == true) {
            await this.openNote(this.noteObject.id);
        } else {
            alert(saveTryResult.error);
            //await this.openNote(this.noteObject.id);
            await this.startOpenedNoteWriting();
        }

    };

    tabScrollPos = {left: 0, top: 0};

    noteTextOnKeyDownEventHandler = (e) => {
        let tabElement = document.getElementById("readAndWrite");

        this.tabScrollPos.left = tabElement.scrollLeft;
        this.tabScrollPos.top = tabElement.scrollTop;
    };

    noteTextInputEventHandler = async (e) => {
        //e.preventDefault();

        this.noteObject.sourceText = e.target.value;

        let tabElement = document.getElementById("readAndWrite");
        tabElement.scrollTo(this.tabScrollPos.left, this.tabScrollPos.top);
    };

    setNoteSourceText = async (text) => {
        this.noteObject.sourceText = text;
    };

    noteNameInputEventHandler = async (e) => {
        this.noteObject.name = e.target.value;
    }

    noteIsPrimaryChangeEventHandler = async (e) => {
        this.noteObject.isPrimary = !this.noteObject.isPrimary;
    }

    noteAliasesListChangeEventHandler = async (newList) => {
        this.noteObject.aliasesList = newList;
    };

}
//86b1f541-c454-4478-a185-a25031a8a1d2-1915d40dedf
export const noteTabStore = new NoteTabStore();