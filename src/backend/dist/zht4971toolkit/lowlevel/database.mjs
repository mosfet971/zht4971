import easyFs from "./easyFs.mjs";
import cryptog from "./cryptog.mjs";
let exp = {};
exp.cleanUp = (databaseDirPath) => {
    let dbRootPath = databaseDirPath + "database/";
    easyFs.rmDir(dbRootPath + "temp/");
};
exp.checkExist = (databaseDirPath) => {
    let dbRootPath = databaseDirPath + "database/";
    let isExist = easyFs.checkFile(dbRootPath + "masterKey.dbf");
    return isExist;
};
exp.create = (databaseDirPath, password) => {
    let dbRootPath = databaseDirPath + "database/";
    easyFs.mkDir(dbRootPath);
    let mk = cryptog.random256hex();
    let encryptedMk = cryptog.aes256.encryptString(mk, cryptog.slowSha256(password));
    easyFs.writeTextToFile(dbRootPath + "masterKey.dbf", JSON.stringify(encryptedMk));
};
exp.newId = () => {
    return cryptog.newUUID() + "-" + Date.now().toString(16);
};
exp.getMasterKey = (databaseDirPath, password) => {
    let dbRootPath = databaseDirPath + "database/";
    let encryptedMk = JSON.parse(easyFs.getFileText(dbRootPath + "masterKey.dbf"));
    let mk = cryptog.aes256.decryptString(encryptedMk.aesMessage, cryptog.slowSha256(password), encryptedMk.aesIv);
    //console.log("mk", mk)
    return mk;
};
exp.generateEntityTypeObject = (name, validator) => {
    return ({ name, validator });
};
exp.setEntity = (databaseDirPath, mk, entityType, entityId, entityObj) => {
    let dbRootPath = databaseDirPath + "database/";
    if (!(entityType.validator(entityObj))) {
        throw new Error("Invalid entity");
    }
    let idListFilePath = (dbRootPath + entityType.name + ".dbf");
    if (!easyFs.checkFile(idListFilePath)) {
        easyFs.writeTextToFile(idListFilePath, JSON.stringify([]));
    }
    let idList = JSON.parse(easyFs.getFileText(idListFilePath));
    if (!idList.includes(entityId)) {
        idList.push(entityId);
    }
    easyFs.writeTextToFile(idListFilePath, JSON.stringify(idList));
    let dirPath = dbRootPath + entityId[0] + entityId[1] + "/" + entityId[2] + entityId[3] + "/";
    easyFs.mkDir(dirPath);
    let entityFilePath = dirPath + entityId + ".dbf";
    let cryptedEntityJson = JSON.stringify(cryptog.aes256.encryptString(JSON.stringify(entityObj), mk));
    easyFs.writeTextToFile(entityFilePath, cryptedEntityJson);
};
exp.setBuffer = (databaseDirPath, mk, bufferId, buffer) => {
    let dbRootPath = databaseDirPath + "database/";
    let dirPath = dbRootPath + bufferId[0] + bufferId[1] + "/" + bufferId[2] + bufferId[3] + "/";
    easyFs.mkDir(dirPath);
    let bufferFilePath = dirPath + bufferId + ".dbf";
    let encryptedBuffer = cryptog.aes256.encryptBuffer(buffer, mk);
    easyFs.writeBufferToFile(bufferFilePath, encryptedBuffer);
};
exp.getBuffer = (databaseDirPath, mk, bufferId) => {
    let dbRootPath = databaseDirPath + "database/";
    let dirPath = dbRootPath + bufferId[0] + bufferId[1] + "/" + bufferId[2] + bufferId[3] + "/";
    let bufferFilePath = dirPath + bufferId + ".dbf";
    let encryptedBuffer = easyFs.getFileBuffer(bufferFilePath);
    let decryptedBuffer = cryptog.aes256.decryptBuffer(encryptedBuffer, mk);
    return (decryptedBuffer);
};
exp.rmBuffer = (databaseDirPath, mk, bufferId) => {
    let dbRootPath = databaseDirPath + "database/";
    let dirPath = dbRootPath + bufferId[0] + bufferId[1] + "/" + bufferId[2] + bufferId[3] + "/";
    let bufferFilePath = dirPath + bufferId + ".dbf";
    easyFs.rmFile(bufferFilePath);
};
exp.getEntitiesIdsByType = (databaseDirPath, mk, entityType) => {
    let dbRootPath = databaseDirPath + "database/";
    let idListFilePath = (dbRootPath + entityType.name + ".dbf");
    if (!easyFs.checkFile(idListFilePath)) {
        easyFs.writeTextToFile(idListFilePath, JSON.stringify([]));
    }
    let idList = JSON.parse(easyFs.getFileText(idListFilePath));
    return (idList);
};
exp.getEntity = (databaseDirPath, mk, entityType, entityId) => {
    let dbRootPath = databaseDirPath + "database/";
    let dirPath = dbRootPath + entityId[0] + entityId[1] + "/" + entityId[2] + entityId[3] + "/";
    let entityFilePath = dirPath + entityId + ".dbf";
    let encryptedEntity = JSON.parse(easyFs.getFileText(entityFilePath));
    let decryptedEntityJson = cryptog.aes256.decryptString(encryptedEntity.aesMessage, mk, encryptedEntity.aesIv);
    let entityObj = JSON.parse(decryptedEntityJson);
    if (!(entityType.validator(entityObj))) {
        throw new Error("Invalid entity");
    }
    return entityObj;
};
exp.changePassword = (databaseDirPath, oldPassword, newPassword) => {
    let dbRootPath = databaseDirPath + "database/";
    let encryptedMk = JSON.parse(easyFs.getFileText(dbRootPath + "masterKey.dbf"));
    let mk;
    try {
        mk = cryptog.aes256.decryptString(encryptedMk.aesMessage, cryptog.slowSha256(oldPassword), encryptedMk.aesIv);
    }
    catch (error) {
        throw new Error("Wrong password");
    }
    encryptedMk = cryptog.aes256.encryptString(mk, cryptog.slowSha256(newPassword));
    easyFs.writeTextToFile(dbRootPath + "masterKey.dbf", JSON.stringify(encryptedMk));
};
exp.rmEntity = (databaseDirPath, mk, entityType, entityId) => {
    let dbRootPath = databaseDirPath + "database/";
    let dirPath = dbRootPath + entityId[0] + entityId[1] + "/" + entityId[2] + entityId[3] + "/";
    let entityFilePath = dirPath + entityId + ".dbf";
    easyFs.rmFile(entityFilePath);
    let idListFilePath = (dbRootPath + entityType.name + ".dbf");
    let idList = JSON.parse(easyFs.getFileText(idListFilePath));
    let newIdList = [];
    for (const j of idList) {
        if (j == entityId) {
            continue;
        }
        else {
            newIdList.push(j);
        }
    }
    easyFs.writeTextToFile(idListFilePath, JSON.stringify(newIdList));
};
export default exp;
