import database from "../lowlevel/database.mjs";
import Fuse from 'fuse.js';
class NotesTools {
    constructor(dbDirPath, mk) {
        this.dbDirPath = dbDirPath;
        this.mk = mk;
        this.entityTypeForNotes = database.generateEntityTypeObject("note", (o) => true);
    }
    createBlankNoteObjectAndSave = () => {
        let id = database.newId();
        let blankNoteObject = ({
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
            historicalDateAccuracyLevel_1_2_3: 1,
            sourceText: "Текст новой записи",
            taggedNotesIds: [],
            associatedNotesIds: []
        });
        database.setEntity(this.dbDirPath, this.mk, this.entityTypeForNotes, blankNoteObject.id, blankNoteObject);
        return (blankNoteObject);
    };
    save = (noteObject) => {
        if (!this.isNameFreeForNoteWithId(noteObject.name, noteObject.id)) {
            throw new Error("Note name is not free");
        }
        for (const i of noteObject.aliasesList) {
            if (!this.isNameFreeForNoteWithId(i, noteObject.id)) {
                throw new Error("Note alias is not free");
            }
        }
        if (noteObject.tagsNotesListIds.includes(noteObject.id)) {
            throw new Error("Invalid tag (recursion)");
        }
        if (noteObject.hasHistoricalDate) {
            let historicalDateAccuracyLevels = [1, 2, 3];
            if (!(historicalDateAccuracyLevels.includes(noteObject.historicalDateAccuracyLevel_1_2_3))) {
                throw new Error("Invalid historical time accuracy level (must be 1, 2 or 3)");
            }
            if (!(noteObject.name
                .replaceAll(/\([0-9]{2}\.[0-9]{2}\.[0-9]{4}\)/g, "date_marker")
                .replaceAll(/\([0-9]{2}\.[0-9]{4}\)/g, "date_marker")
                .replaceAll(/\([0-9]{4}\)/g, "date_marker")
                .includes("date_marker"))) {
                throw new Error("Name not includes historical date in (yyyy), (mm.yyyy) or (dd.mm.yyyy) format");
            }
            let historicalDateNumberCheckPas = false;
            try {
                if ((noteObject
                    .name
                    .match(/\([0-9]{2}\.[0-9]{2}\.[0-9]{4}\)/g))[0]
                    .replaceAll("(", "").replaceAll(")", "")
                    .split(".").reverse().join(".")
                    .replaceAll(".", "")
                    == noteObject.historicalDateNumber.toString().split("").slice(0, 8).join("")) {
                    historicalDateNumberCheckPas = true;
                }
            }
            catch (error) {
            }
            try {
                if ((noteObject
                    .name
                    .match(/\([0-9]{2}\.[0-9]{4}\)/g))[0]
                    .replaceAll("(", "").replaceAll(")", "")
                    .split(".").reverse().join(".")
                    .replaceAll(".", "")
                    == noteObject.historicalDateNumber.toString().split("").slice(0, 6).join("")) {
                    historicalDateNumberCheckPas = true;
                }
            }
            catch (error) {
            }
            try {
                if ((noteObject
                    .name
                    .match(/\([0-9]{4}\)/g))[0]
                    .replaceAll("(", "").replaceAll(")", "")
                    .split(".").reverse().join(".")
                    .replaceAll(".", "")
                    == noteObject.historicalDateNumber.toString().split("").slice(0, 4).join("")) {
                    historicalDateNumberCheckPas = true;
                }
            }
            catch (error) {
            }
            if (!historicalDateNumberCheckPas) {
                throw new Error("Name includes invalid historical date");
            }
        }
        noteObject.editionTime = Date.now();
        this._unsetupAllTagsFromNote(noteObject.id, false);
        for (const i of noteObject.tagsNotesListIds) {
            this._addTagToNote(noteObject.id, i);
        }
        this._unsetupAllAssociationsFromNote(noteObject.id);
        //console.log(noteObject);
        for (const i of noteObject.associatedNotesIds) {
            this._addAssociation(noteObject.id, i);
        }
        database.setEntity(this.dbDirPath, this.mk, this.entityTypeForNotes, noteObject.id, noteObject);
    };
    /**
     * {
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
            historicalDateAccuracyLevel_1_2_3: 1,
            sourceText: "Текст новой записи",
            taggedNotesIds: [],
            associatedNotesIds: []
        }
     */
    getInfo = (id) => {
        let noteObject = database.getEntity(this.dbDirPath, this.mk, this.entityTypeForNotes, id);
        noteObject["sourceText"] = "";
        return noteObject;
    };
    get = (id) => {
        let noteObject = database.getEntity(this.dbDirPath, this.mk, this.entityTypeForNotes, id);
        let noteObject2 = { ...noteObject };
        noteObject2.lastGetTime = Date.now();
        database.setEntity(this.dbDirPath, this.mk, this.entityTypeForNotes, noteObject2.id, noteObject2);
        return noteObject;
    };
    getNoteIdByNameOrAlias = (name) => {
        let listOfNotesIds = this.getListOfIds();
        let listOfNotNotesInfo = [];
        for (const i of listOfNotesIds) {
            listOfNotNotesInfo.push(this.getInfo(i));
        }
        const options = {
            includeScore: true,
            keys: ['name', 'aliasesList']
        };
        const fuse = new Fuse(listOfNotNotesInfo, options);
        let result = fuse.search(name)[0];
        if (result.score > 0.3) {
            throw (new Error("Error: note not founded"));
        }
        let noteId = result.item.id;
        return noteId;
    };
    getListOfIds = () => {
        return database.getEntitiesIdsByType(this.dbDirPath, this.mk, this.entityTypeForNotes);
    };
    delete = (id) => {
        this._unsetupAllTagsFromNote(id, true);
        this._unsetupAllAssociationsFromNote(id);
        database.rmEntity(this.dbDirPath, this.mk, this.entityTypeForNotes, id);
    };
    _unsetupAllTagsFromNote = (noteId, isUntagFromThisNoteAllTagedByThisNoteNotesNeeded) => {
        let noteObject = this.get(noteId);
        if (isUntagFromThisNoteAllTagedByThisNoteNotesNeeded) {
            for (const i of noteObject.taggedNotesIds) {
                let noteObject2 = this.get(i);
                noteObject2.tagsNotesListIds = noteObject2.tagsNotesListIds.filter((v) => v !== noteId);
                database.setEntity(this.dbDirPath, this.mk, this.entityTypeForNotes, noteObject2.id, noteObject2);
            }
            noteObject.taggedNotesIds = [];
        }
        for (const i of noteObject.tagsNotesListIds) {
            let noteObject2 = this.get(i);
            noteObject2.taggedNotesIds = noteObject2.taggedNotesIds.filter((v) => v !== noteId);
            database.setEntity(this.dbDirPath, this.mk, this.entityTypeForNotes, noteObject2.id, noteObject2);
        }
        noteObject.tagsNotesListIds = [];
        database.setEntity(this.dbDirPath, this.mk, this.entityTypeForNotes, noteObject.id, noteObject);
    };
    _addTagToNote = (noteId, tagId) => {
        let noteObject = this.get(noteId);
        if (!noteObject.tagsNotesListIds.includes(tagId)) {
            noteObject.tagsNotesListIds.push(tagId);
        }
        database.setEntity(this.dbDirPath, this.mk, this.entityTypeForNotes, noteObject.id, noteObject);
        let tagNoteObject = this.get(tagId);
        if (!tagNoteObject.taggedNotesIds.includes(noteId)) {
            tagNoteObject.taggedNotesIds.push(noteId);
        }
        database.setEntity(this.dbDirPath, this.mk, this.entityTypeForNotes, tagNoteObject.id, tagNoteObject);
    };
    _addAssociation = (noteId, associatedNoteId) => {
        let noteObject = this.get(noteId);
        if (!noteObject.associatedNotesIds.includes(associatedNoteId)) {
            noteObject.associatedNotesIds.push(associatedNoteId);
        }
        database.setEntity(this.dbDirPath, this.mk, this.entityTypeForNotes, noteObject.id, noteObject);
        let associatedNoteObject = this.get(associatedNoteId);
        if (!associatedNoteObject.associatedNotesIds.includes(noteId)) {
            associatedNoteObject.associatedNotesIds.push(noteId);
        }
        database.setEntity(this.dbDirPath, this.mk, this.entityTypeForNotes, associatedNoteObject.id, associatedNoteObject);
    };
    _unsetupAllAssociationsFromNote = (noteId) => {
        let noteObject = this.get(noteId);
        //console.log(noteObject.associatedNotesIds, noteId)
        for (const i of noteObject.associatedNotesIds) {
            let associatedNote = this.get(i);
            associatedNote.associatedNotesIds = associatedNote.associatedNotesIds.filter((v) => v !== noteId);
            database.setEntity(this.dbDirPath, this.mk, this.entityTypeForNotes, associatedNote.id, associatedNote);
            //console.log(this.get(i));
        }
        noteObject.associatedNotesIds = [];
        database.setEntity(this.dbDirPath, this.mk, this.entityTypeForNotes, noteObject.id, noteObject);
    };
    isNameFreeForNoteWithId = (name, id) => {
        let ids = this.getListOfIds();
        let isExist = false;
        let idOfExist = "";
        for (const i of ids) {
            let noteObject = this.getInfo(i);
            if (noteObject.name == name) {
                isExist = true;
                idOfExist = noteObject.id;
            }
            else if (noteObject.aliasesList.includes(name)) {
                isExist = true;
                idOfExist = noteObject.id;
            }
        }
        if (!isExist) {
            return true;
        }
        else if (idOfExist == id) {
            return true;
        }
        else {
            return false;
        }
    };
}
export default NotesTools;
