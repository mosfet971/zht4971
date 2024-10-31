import database from "../lowlevel/database.mjs";
import Fuse from 'fuse.js';
class NotesTools {
    constructor(dbDirPath, mk) {
        this.dbDirPath = dbDirPath;
        this.mk = mk;
        this.entityTypeForNotes = database.generateEntityTypeObject("note", (o) => true);
    }
    _getBlankNoteObject = () => {
        let id = database.newId();
        return ({
            id: id,
            name: "Новая запись " + id,
            aliasesList: [],
            isPrimary: false,
            noteTypeNumber: 0,
            tagsNotesListIds: [],
            lastGetTime: Date.now(),
            creationTime: Date.now(),
            editionTime: Date.now(),
            hasHistoricalDate: false,
            historicalDateNumber: 19700101, // 1970 01 01
            historicalDateAccuracyLevel_1_2_3: 3,
            sourceText: "Текст новой записи",
            taggedNotesIds: [],
            associatedNotesIds: [],
            linksSourcesIds: []
        });
    };
    createBlankNoteObjectAndSave = () => {
        let blankNoteObject = this._getBlankNoteObject();
        database.setEntity(this.dbDirPath, this.mk, this.entityTypeForNotes, blankNoteObject.id, blankNoteObject);
        return (blankNoteObject);
    };
    save = (noteObject) => {
        let noteObjectBeforeChanges = this.get(noteObject.id, false);
        if (noteObject.name.includes("|")) {
            throw new Error('Ошибка: указанное название записи содержит недопустимый символ ("|")');
        }
        if (noteObject.name.includes("[")) {
            throw new Error('Ошибка: указанное название записи содержит недопустимый символ ("[")');
        }
        if (noteObject.name.includes("]")) {
            throw new Error('Ошибка: указанное название записи содержит недопустимый символ ("]")');
        }
        if (!this.isNameFreeForNoteWithId(noteObject.name, noteObject.id)) {
            throw new Error("Ошибка: указанное название уже занято другой записью");
        }
        for (const i of noteObject.aliasesList) {
            if (!this.isNameFreeForNoteWithId(i, noteObject.id)) {
                throw new Error("Ошибка: один из указанных псевдонимов уже занят другой записью");
            }
            if (i.includes("|")) {
                throw new Error('Ошибка: недопустимый символ ("|") в одном из псевдонимов записи');
            }
            if (i.includes("[")) {
                throw new Error('Ошибка: недопустимый символ ("[") в одном из псевдонимов записи');
            }
            if (i.includes("]")) {
                throw new Error('Ошибка: недопустимый символ ("]") в одном из псевдонимов записи');
            }
        }
        if (noteObject.tagsNotesListIds.includes(noteObject.id)) {
            throw new Error("Ошибка: указан недопустимый тег (самоссылка)");
        }
        if (noteObject.hasHistoricalDate) {
            let historicalDateAccuracyLevels = [1, 2, 3];
            if (!(historicalDateAccuracyLevels.includes(noteObject.historicalDateAccuracyLevel_1_2_3))) {
                throw new Error("Ошибка: недопустимый уровень точности даты (должен быть равен 1, 2 или 3)");
            }
            if (!(noteObject.name
                .replaceAll(/\([0-9]{2}\.[0-9]{2}\.[0-9]{4}\)/g, "date_marker")
                .replaceAll(/\([0-9]{2}\.[0-9]{4}\)/g, "date_marker")
                .replaceAll(/\([0-9]{4}\)/g, "date_marker")
                .includes("date_marker"))) {
                throw new Error("Ошибка: название записи не включает указанную дату в формате (дд.мм.гггг), (мм.гггг) или (гггг)");
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
                throw new Error("Ошибка: даты в названии и данных не совпадают");
            }
        }
        noteObject.editionTime = Date.now();
        noteObject.associatedNotesIds = [];
        /*
        this._unsetupAllTagsFromNote(noteObject.id, false);

        for (const i of noteObject.tagsNotesListIds) {
            this._addTagToNote(noteObject.id, i)
        }

        this._unsetupAllAssociationsFromNote(noteObject.id);

        //console.log(noteObject);
        for (const i of noteObject.associatedNotesIds) {
            this._addAssociation(noteObject.id, i);
        }
        */
        database.setEntity(this.dbDirPath, this.mk, this.entityTypeForNotes, noteObject.id, noteObject);
        //this._cleanupLinksSourcesIdsList(noteObjectBeforeChanges, noteObject);
        // TODO: добавить в список id записей с сылками, которые стали подходить
        // после переименования или создания или еще чего-то (обратный cleanup)
        // не только при изменении текста
        this._findLinks(noteObject);
        this._updateOutLinksFromNote(noteObjectBeforeChanges, noteObject);
    };
    /**
    {
        id: id,
        name: "Новая запись " + id,
        aliasesList: [],
        isPrimary: false,
        noteTypeNumber: 0,
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
    getInfo = (id) => {
        let noteObject = database.getEntity(this.dbDirPath, this.mk, this.entityTypeForNotes, id);
        noteObject["sourceText"] = "";
        return noteObject;
    };
    get = (id, isUserCall) => {
        let noteObject = database.getEntity(this.dbDirPath, this.mk, this.entityTypeForNotes, id);
        noteObject.associatedNotesIds = [];
        for (const i of noteObject.linksSourcesIds) {
            noteObject.associatedNotesIds = this._addToSet(noteObject.associatedNotesIds, i);
        }
        for (const i of this._getLinksTargetsIdsListByNoteObject(noteObject)) {
            noteObject.associatedNotesIds = this._addToSet(noteObject.associatedNotesIds, i);
        }
        //console.log(isUserCall);
        if (isUserCall == true) {
            let noteObject2 = { ...noteObject };
            noteObject2.lastGetTime = Date.now();
            database.setEntity(this.dbDirPath, this.mk, this.entityTypeForNotes, noteObject2.id, noteObject2);
            return noteObject2;
        }
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
        this._updateOutLinksFromNote(this.get(id, false), this._getBlankNoteObject());
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
    _addToSet = (set, value) => {
        let s = [...set];
        if (!s.includes(value)) {
            s.push(value);
        }
        return (s);
    };
    _rmFromSet = (set, value) => {
        let s = [...set];
        s = s.filter((v) => !(v == value));
        return (s);
    };
    _getLinksTargetsIdsListByNoteObject = (noteObject) => {
        let linksTargetsIds = [];
        for (const j of noteObject.sourceText.matchAll(/\[\[(.*?)\]\]/g)) {
            let i = j[0];
            let noteName = i.replaceAll(/\[|\]|/g, "");
            if (noteName.includes("|")) {
                let parts = noteName.split("|");
                noteName = parts[0];
            }
            try {
                let noteId = this.getNoteIdByNameOrAlias(noteName);
                linksTargetsIds.push(noteId);
                continue;
            }
            catch (error) {
                continue;
            }
        }
        return linksTargetsIds;
    };
    /*
    _cleanupLinksSourcesIdsList = (oldNoteObject, newNoteObject) => {
        //очитска от битых ссылок
        let noteObject = JSON.parse(JSON.stringify(newNoteObject));
        let noteObjectsOfSources = [];
        let listOfWrongIds = [];

        for (const i of noteObject.linksSourcesIds) {
            try {
                noteObjectsOfSources = this._addToSet(noteObjectsOfSources, this.get(i, false));
            } catch (error) {
                console.log(error);
                listOfWrongIds = this._addToSet(listOfWrongIds, i);
            }
        }

        for (const i of noteObjectsOfSources) {
            let linksTargetsIds = this._getLinksTargetsIdsListByNoteObject(i);
            if (!(linksTargetsIds.includes(noteObject.id))) {
                listOfWrongIds.push(i.id);
                //console.log(i);
            } else {
                //console.log("no");
            }
        }

        console.log(noteObject, listOfWrongIds);
        for (const i of listOfWrongIds) {
            noteObject.linksSourcesIds = this._rmFromSet(noteObject.linksSourcesIds, i);
        }
        console.log(noteObject);

        database.setEntity(
            this.dbDirPath,
            this.mk,
            this.entityTypeForNotes,
            noteObject.id,
            noteObject
        );
    };
    */
    _updateOutLinksFromNote = (oldNoteObject, newNoteObject) => {
        //добавление новых ссылок и удаление убранных из текста ссылок
        let noteObject1 = JSON.parse(JSON.stringify(oldNoteObject));
        let noteObject2 = JSON.parse(JSON.stringify(newNoteObject));
        let noteId = noteObject1.id;
        let oldLinksList = this._getLinksTargetsIdsListByNoteObject(noteObject1);
        let newLinksList = this._getLinksTargetsIdsListByNoteObject(noteObject2);
        //console.log(oldLinksList, newLinksList);
        //удаляем все старые
        for (const i of oldLinksList) {
            let targetNoteObject = this.get(i, false);
            targetNoteObject.linksSourcesIds = this._rmFromSet(targetNoteObject.linksSourcesIds, noteId);
            database.setEntity(this.dbDirPath, this.mk, this.entityTypeForNotes, targetNoteObject.id, targetNoteObject);
        }
        //добавляем отсавшиеся старые и новые
        for (const i of newLinksList) {
            let targetNoteObject = this.get(i, false);
            targetNoteObject.linksSourcesIds = this._addToSet(targetNoteObject.linksSourcesIds, noteId);
            database.setEntity(this.dbDirPath, this.mk, this.entityTypeForNotes, targetNoteObject.id, targetNoteObject);
        }
    };
    _findLinks = (noteObjectIn) => {
        let noteObject = JSON.parse(JSON.stringify(noteObjectIn));
        let noteObjects = [];
        for (const i of this.getListOfIds()) {
            noteObjects.push(this.get(i, false));
        }
        let idsOfLinksSources = [];
        for (const i of noteObjects) {
            let linksTargetsIds = this._getLinksTargetsIdsListByNoteObject(i);
            if (linksTargetsIds.includes(noteObject.id)) {
                idsOfLinksSources = this._addToSet(idsOfLinksSources, i.id);
            }
        }
        noteObject.linksSourcesIds = idsOfLinksSources;
        database.setEntity(this.dbDirPath, this.mk, this.entityTypeForNotes, noteObject.id, noteObject);
    };
}
export default NotesTools;
