import database from "../lowlevel/database.mjs";
class Utils {
    constructor(notesTools, filesTools, dbDirPath, mk) {
        this.dbDirPath = dbDirPath;
        this.mk = mk;
        this.notesTools = notesTools;
        this.filesTools = filesTools;
    }
    changePassword = (oldPassword, newPassword) => {
        database.changePassword(this.dbDirPath, oldPassword, newPassword);
    };
    getDatabaseStatus = () => {
        let notesNumber = database.getEntitiesIdsByType(this.dbDirPath, this.mk, database.generateEntityTypeObject("note", (o) => true)).length;
        /*
        let templatesNumber = database.getEntitiesIdsByType(
            this.dbDirPath,
            this.mk,
            database.generateEntityTypeObject("template", (o) => true)
        ).length;
        */
        let tagsNumber = (database.getEntitiesIdsByType(this.dbDirPath, this.mk, database.generateEntityTypeObject("tssi", (o) => true)).length) - 1;
        let filesNumber = database.getEntitiesIdsByType(this.dbDirPath, this.mk, database.generateEntityTypeObject("file", (o) => true)).length;
        return ({ notesNumber, tagsNumber, filesNumber });
    };
    collectGarbage = () => {
        let notesIds = this.notesTools.getListOfIds();
        let notes = [];
        for (const i of notesIds) {
            notes.push(this.notesTools.get(i));
        }
        let filesIds = this.filesTools.getListOfIds();
        let filesInNotes = [];
        for (const i of notes) {
            for (const j of filesIds) {
                if (i.sourceText.includes(j)) {
                    if (!(filesInNotes.includes(j))) {
                        filesInNotes.push(j);
                    }
                }
            }
        }
        let idsOfFilesToDelete = [];
        for (const i of filesIds) {
            if (!(filesInNotes.includes(i))) {
                idsOfFilesToDelete.push(i);
            }
        }
        for (const i of idsOfFilesToDelete) {
            this.filesTools.delete(i);
        }
    };
}
export default Utils;
