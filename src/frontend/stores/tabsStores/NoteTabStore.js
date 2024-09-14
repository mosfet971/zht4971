import { makeAutoObservable, runInAction } from "mobx";
import { modalWindowsManagerStore } from "../ModalWindowsManagerStore";
import { tabsManagerStore } from "../TabsManagerStore";
import * as filesFrontendUtils from "../../utils/filesFrontendUtils";
import * as noteObjectRenderer from "../../utils/noteObjectRenderer";

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
        historicalDateAccuracyLevel_1_2_3: 3,
        sourceText: "Текст новой записи",
        taggedNotesIds: [],
        associatedNotesIds: []
    }
    */
    tabScrollPos = { left: 0, top: 0 };
    historyStack = [];
    isFileUploadLoading = false;
    htmlOfCurrentNote = "";

    closeNote = async () => {
        this.noteObject = {};
        this.status = "no";
        this.historyStack = [];
        this.tabScrollPos = { left: 0, top: 0 };
        this.isFileUploadLoading = false;
        this.htmlOfCurrentNote = "";
    };

    openNote = async (noteId) => {
        runInAction(() => { this.status = "loading"; });
        if (await ipcRenderer.invoke("checkNoteExist", noteId)) {
            await tabsManagerStore.openTab("mainTabs", "readAndWrite");
            this.noteObject = await ipcRenderer.invoke("getNoteObject", noteId);

            if (this.historyStack[this.historyStack.length - 1] !== noteId) {
                this.historyStack.push(noteId);
            }

            await this.updateHtmlOfCurrentNote();

            this.status = "view";
        } else {
            await modalWindowsManagerStore.open("WindowError", "Ошибка: запись не существует");
            await this.closeNote();
        }

        //console.log(this.historyStack);
    };

    openNoteByName = async (noteName) => {
        let prevStatus = this.status;
        await runInAction(() => { this.status = "loading"; });
        let resolvedId = await ipcRenderer.invoke("getNoteIdByNameOrAlias", noteName);
        if (resolvedId) {
            await modalWindowsManagerStore.close();
            await this.openNote(resolvedId);
        } else {
            await modalWindowsManagerStore.open("WindowError", "Ошибка: не удалось найти запись");
            await runInAction(() => { this.status = prevStatus; });
        }
    };

    openPrevNote = async () => {
        if (this.historyStack.length < 2) {
            return;
        } else {
            this.historyStack.pop();
            await this.openNote(this.historyStack[this.historyStack.length - 1]);
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
            let errorText = saveTryResult.error.toString().replace("Error: ", "");
            modalWindowsManagerStore.open("WindowError", errorText);
            //await this.openNote(this.noteObject.id);
            await this.startOpenedNoteWriting();
        }

    };


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
    };

    noteIsPrimaryChangeEventHandler = async (e) => {
        this.noteObject.isPrimary = !this.noteObject.isPrimary;
    };

    noteAliasesListChangeEventHandler = async (newList) => {
        this.noteObject.aliasesList = newList;
    };

    noteHasHistoricalDateChangeEventHandler = async (e) => {
        this.noteObject.hasHistoricalDate = !this.noteObject.hasHistoricalDate;
    };

    noteHistoricalDateAccuracyLevelChangeEventHandler = async (newNum) => {
        this.noteObject.historicalDateAccuracyLevel_1_2_3 = newNum;
    };

    get currentNoteHistoricalDate() {
        let str = this.noteObject.historicalDateNumber.toString();
        return {
            year: parseInt(str.substring(0, str.length - 4)),
            month: parseInt(str.substring(str.length - 4, str.length - 2)),
            day: parseInt(str.substring(str.length - 2, str.length)),
        };
    }

    setNoteHistoricalDatePart = async (newValue, partName) => {
        let str = this.noteObject.historicalDateNumber.toString();

        switch (partName) {
            case "year":
                this.noteObject.historicalDateNumber = parseInt(str.replaceAll(this.currentNoteHistoricalDate.year.toString(), newValue.toString()));
                break;
            case "month":
                this.noteObject.historicalDateNumber = parseInt(str.substring(0, str.length - 4) + newValue.toString().padStart(2, "0") + str.substring(str.length - 2, str.length));
                break;
            case "day":
                this.noteObject.historicalDateNumber = parseInt(str.substring(0, str.length - 2) + newValue.toString().padStart(2, "0"));
                break;

            default:
                break;
        }
        return;
    };

    setNoteObjectAssocsList = async (newList) => {
        this.noteObject.associatedNotesIds = newList;
        return;
    };

    selectFileEventHandler = async (e) => {
        runInAction(() => { this.isFileUploadLoading = true; });
        for (const file of e.target.files) {
            let fileId = await filesFrontendUtils.saveNewFile(file);
            this.noteObject.sourceText += "\n\n![[" + fileId + "]]\n\n";
        }
        runInAction(() => { this.isFileUploadLoading = false; });
    }

    updateHtmlOfCurrentNote = async () => {
        this.htmlOfCurrentNote = await noteObjectRenderer.renderNoteObjectToHtml(this.noteObject);
    }
}
//86b1f541-c454-4478-a185-a25031a8a1d2-1915d40dedf
export const noteTabStore = new NoteTabStore();