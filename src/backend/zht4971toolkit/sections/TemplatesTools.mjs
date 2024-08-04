import database from "../lowlevel/database.mjs";

class TemplatesTools {
    constructor(dbDirPath, mk) {
        this.dbDirPath = dbDirPath;
        this.mk = mk;

        this.entityTypeForTemplates = database.generateEntityTypeObject("template", (o) => true);
    }

    createTemplateObject = (templateText, name) => {
        let id = database.newId();
        return ({ id: id, name: name, text: templateText});
    }

    save = (templateObject) => {
        database.setEntity(
            this.dbDirPath,
            this.mk,
            this.entityTypeForTemplates,
            templateObject.id,
            templateObject
        );
    };

    /**
     * { text: templateText, id: templateId }
     */
    get = (templateId) => {
        return database.getEntity(this.dbDirPath, this.mk, this.entityTypeForTemplates, templateId);
    };

    getListOfIds = () => {
        return database.getEntitiesIdsByType(this.dbDirPath, this.mk, this.entityTypeForTemplates);
    };

    delete = (templateId) => {
        database.rmEntity(this.dbDirPath, this.mk, this.entityTypeForTemplates, templateId);
    };
}

export default TemplatesTools;