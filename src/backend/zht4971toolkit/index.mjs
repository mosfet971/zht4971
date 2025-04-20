import database from "./lowlevel/database.mjs";

import NotesTools from "./sections/NotesTools.mjs";
import FilesTools from "./sections/FilesTools.mjs";
import TemplatesTools from "./sections/TemplatesTools.mjs";
import NotesSearchTools from "./sections/NotesSearchTools.mjs"
import Utils from "./sections/Utils.mjs";
import ZhtTagSearchTools from "./sections/ZhtTagSearchTools.mjs";

class ZhtToolkit {
    constructor(dbDirPath, embeddingsJsonPath, password) {
        
        if(!database.checkExist(dbDirPath)) {
            database.create(dbDirPath, password);
        }

        let mk = database.getMasterKey(dbDirPath, password);

        this.zhtTagSearchTools = new ZhtTagSearchTools(embeddingsJsonPath, dbDirPath, mk);
        this.notesTools = new NotesTools(this.zhtTagSearchTools, dbDirPath, mk);
        this.filesTools = new FilesTools(dbDirPath, mk);
        this.templatesTools = new TemplatesTools(dbDirPath, mk);
        this.notesSearchTools = new NotesSearchTools(this.notesTools);
        this.utils = new Utils(this.notesTools, this.filesTools, dbDirPath, mk);
    }

    getNewId = ()=> {
        return database.newId();
    };
}

export default ZhtToolkit;