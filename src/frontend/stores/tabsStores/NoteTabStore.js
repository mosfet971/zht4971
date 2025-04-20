import { autorun, makeAutoObservable, reaction, runInAction } from "mobx";
import { modalWindowsManagerStore } from "../ModalWindowsManagerStore";
import { tabsManagerStore } from "../TabsManagerStore";
import * as filesFrontendUtils from "../../utils/filesFrontendUtils";
import * as noteObjectRenderer from "../../utils/noteObjectRenderer";

class NoteTabStore {
    constructor() {
        makeAutoObservable(this);

        autorun(() => {
            console.log("default");
            let newDefaultTags = [];

            let str = this.noteObject.historicalDateNumber.toString();
            let date = {
                year: parseInt(str.substring(0, str.length - 4)),
                month: parseInt(str.substring(str.length - 4, str.length - 2)),
                day: parseInt(str.substring(str.length - 2, str.length)),
            };

            let defaultTagsMap = [
                "Год: " + date.year,
                "Месяц: " + date.month,
                "День: " + date.day,
                "Идентификатор: " + this.noteObject.id,
                "Название: " + this.noteObject.name,
                this.noteObject.isPrimary ? "Избранное" : "Обычная запись"
            ];

            //add base
            for (const tag of defaultTagsMap) {
                newDefaultTags.push(tag);
            }

            //add aliases
            for (const tag of this.noteObject.aliasesList) {
                newDefaultTags.push("Псевдоним: " + tag);
            }

            this.defaultTags = JSON.parse(JSON.stringify(newDefaultTags));
        });
    }

    status = "no"; // "no", "view", "edit", "loading"
    noteObject = {};
    tabScrollPos = { left: 0, top: 0 };
    historyStack = [];
    isFileUploadLoading = false;
    htmlOfCurrentNote = "";
    defaultTags = [];
    userTags = [];

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

            //this.defaultTags============================================================
            this.noteObject = await ipcRenderer.invoke("getNoteObjectByUser", noteId);
            let newDefaultTags = [];

            let str = this.noteObject.historicalDateNumber.toString();
            let date = {
                year: parseInt(str.substring(0, str.length - 4)),
                month: parseInt(str.substring(str.length - 4, str.length - 2)),
                day: parseInt(str.substring(str.length - 2, str.length)),
            };

            let defaultTagsMap = [
                "Год: " + date.year,
                "Месяц: " + date.month,
                "День: " + date.day,
                "Идентификатор: " + this.noteObject.id,
                "Название: " + this.noteObject.name,
                this.noteObject.isPrimary ? "Избранное" : "Обычная запись"
            ];

            //add base
            for (const tag of defaultTagsMap) {
                newDefaultTags.push(tag);
            }

            //add aliases
            for (const tag of this.noteObject.aliasesList) {
                newDefaultTags.push("Псевдоним: " + tag);
            }

            this.defaultTags = JSON.parse(JSON.stringify(newDefaultTags));
            //this.defaultTags=======================================================================

            this.userTags = JSON.parse(JSON.stringify(this.noteObject.tagsStrings)).filter((v) => !(JSON.parse(JSON.stringify(this.defaultTags)).includes(v)));

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

    openNoteByName = async (noteName, semanticDateNumber) => {
        let prevStatus = this.status;
        await runInAction(() => { this.status = "loading"; });
        let resolvedId = await ipcRenderer.invoke("getNoteIdByNameOrAlias", { name: noteName, semanticDateNumber: semanticDateNumber });
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
        this.noteObject.tagsStrings = JSON.parse(JSON.stringify(this.defaultTags));
        for (const i of JSON.parse(JSON.stringify(this.userTags))) {
            this.noteObject.tagsStrings.push(i);
        }

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

    setNoteObject = async (noteObject) => {
        for (const i of Object.keys(noteObject)) {
            if (i !== "id") {
                this.noteObject[i] = noteObject[i];
            }
        }
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

    noteHistoricalDateAccuracyLevelChangeEventHandler = async (e) => {
        this.noteObject.historicalDateAccuracyLevel_1_2_3 = parseInt(e.target.value);
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
            this.noteObject.sourceText += "\n!![[" + fileId + "]]";
        }
        //e.target.files = [];
        runInAction(() => { this.isFileUploadLoading = false; });
    };

    updateHtmlOfCurrentNote = async () => {
        this.htmlOfCurrentNote = await noteObjectRenderer.renderNoteObjectToHtml(this.noteObject);
    };

    setNoteTypeNumber = async (newLevel) => {
        this.noteObject.noteTypeNumber = parseInt(newLevel);
    };

    noteTagsStringsChangeEventHandler = async (newList) => {
        this.userTags = newList;
    };
}

export const noteTabStore = new NoteTabStore();