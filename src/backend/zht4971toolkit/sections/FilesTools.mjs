import database from "../lowlevel/database.mjs";

class FilesTools {
    constructor(dbDirPath, mk) {
        this.dbDirPath = dbDirPath;
        this.mk = mk;

        this.entityTypeForFiles = database.generateEntityTypeObject("file", (o) => true);
    }

    createFileObjectAndSave = (fileName, fileBuffer, fileMimeType) => {
        let fileBufferId = database.newId();
        let fileId = database.newId();
        let fileObject = { id: fileId, name: fileName, fileBufferId: fileBufferId, mimeType: fileMimeType };
        database.setEntity(
            this.dbDirPath,
            this.mk,
            this.entityTypeForFiles,
            fileObject.id,
            fileObject
        );
        database.setBuffer(this.dbDirPath, this.mk, fileBufferId, fileBuffer);

        return fileId;
    }

    /**
     * { id: fileId, name: fileName, mimeType: fileMimeType }
     */
    getInfo = (fileId) => {
        let infoObject = database.getEntity(this.dbDirPath, this.mk, this.entityTypeForFiles, fileId);
        infoObject["fileBufferId"] = "";
        return infoObject;
    };


    /**
     * { id: fileObject.id, name: fileObject.name, fileBuffer: buffer, mimeType: fileObject.mimeType }
     */
    get = (fileId) => {
        let fileObject = database.getEntity(this.dbDirPath, this.mk, this.entityTypeForFiles, fileId);
        let buffer = database.getBuffer(this.dbDirPath, this.mk, fileObject.fileBufferId);
        return { id: fileObject.id, name: fileObject.name, fileBuffer: buffer, mimeType: fileObject.mimeType };
    };

    getListOfIds = () => {
        return database.getEntitiesIdsByType(this.dbDirPath, this.mk, this.entityTypeForFiles);
    };

    delete = (fileId) => {
        let fileObject = database.getEntity(this.dbDirPath, this.mk, this.entityTypeForFiles, fileId);
        database.rmBuffer(this.dbDirPath, this.mk, fileObject.fileBufferId);
        database.rmEntity(this.dbDirPath, this.mk, this.entityTypeForFiles, fileId);
    };
}

export default FilesTools;