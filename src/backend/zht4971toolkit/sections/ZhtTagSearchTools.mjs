import TagSearchToolkit from "./utils/TagSearchToolkit.mjs";
import database from "../lowlevel/database.mjs";
import crypto from "crypto";

function stringToHash(string, mk) {
    return crypto.createHash("sha256", { encoding: "utf-8" }).update(string).update("2a00f8a3-131e-428f-b5fc-0832fe50965d").digest("hex");
}
function stringToHashOld(string, mk) {
    return crypto.createHash("sha256", { encoding: "utf-8" }).update(string).update("2a00f8a3-131e-428f-b5fc-0832fe50965d").digest("base64url");
}

class ZhtTagSearchTools extends TagSearchToolkit {
    constructor(embeddingsJsonPath, dbDirPath, mk) {

        let entityTypeForTagSearchSystemItem = database.generateEntityTypeObject("tssi", (o) => true);

        let setAllTagsEmbeddingsFunction = (newValue) => {
            database.setEntity(
                dbDirPath,
                mk,
                entityTypeForTagSearchSystemItem,
                "tagsTable",
                { value: newValue }
            );
        };
        let getAllTagsEmbeddingsFunction = () => {
            let value = [];
            try {
                value = (database.getEntity(dbDirPath, mk, entityTypeForTagSearchSystemItem, "tagsTable")).value;
            } catch (error) {
                value = [];
            }
            return value;
        };

        let setIndexListFunction = (key, valueList) => {
            let listId = stringToHash(key, mk);

            database.setEntity(
                dbDirPath,
                mk,
                entityTypeForTagSearchSystemItem,
                listId,
                { value: valueList }
            );
        };

        let getIndexListFunction = (key) => {
            let listId = stringToHash(key, mk);

            let value = [];
            try {
                value = (database.getEntity(
                    dbDirPath,
                    mk,
                    entityTypeForTagSearchSystemItem,
                    listId
                )).value;
            } catch (error) {
                value = [];
            }

            let listIdOld = stringToHashOld(key, mk);

            let valueOld = [];
            try {
                valueOld = (database.getEntity(
                    dbDirPath,
                    mk,
                    entityTypeForTagSearchSystemItem,
                    listIdOld
                )).value;
            } catch (error) {
                valueOld = [];
            }

            for (const i of valueOld) {
                if(!(value.includes(i))) {
                    value.push(i);
                }
            }

            return value;
        };

        super(
            embeddingsJsonPath,
            getAllTagsEmbeddingsFunction,
            setAllTagsEmbeddingsFunction,
            getIndexListFunction,
            setIndexListFunction
        );
    }
}

export default ZhtTagSearchTools;