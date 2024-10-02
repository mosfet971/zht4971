import { workerData, parentPort } from 'worker_threads';
import ZhtToolkit from './zht4971toolkit/index.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let f = async () => {
    let result = {};
    let zhtToolkit;
    let { action, password, params } = workerData;
    if (__dirname.includes(".asar/")) {
        zhtToolkit = new ZhtToolkit(path.join(__dirname, "../../../../../"), password);
    }
    else {
        zhtToolkit = new ZhtToolkit(path.join(__dirname, "../../../"), password);
    }
    switch (action) {
        case "getPrimaryList":
            let sortModeToParamNameMap = {
                "byCreationTime": "creationTime",
                "byGetTime": "lastGetTime",
                "byEditionTime": "editionTime"
            };
            let paramName = sortModeToParamNameMap[params.sortMode];
            let isNeedInvertedOrderList = params.sortOrder == "bToA";
            let filters = await zhtToolkit.notesSearchTools.creteBlankFiltersList();
            filters = await zhtToolkit.notesSearchTools.addPramBoolFilter(filters, "isPrimary", true, false);
            let ids = await zhtToolkit.notesSearchTools.getListOfNotesIdsSortedByParamWithFilters(paramName, filters, isNeedInvertedOrderList);
            let objs = [];
            for (const id of ids) {
                let obj = await zhtToolkit.notesTools.get(id, false);
                objs.push({ name: obj.name, id: obj.id });
            }
            result = objs;
            break;
        case "getNoteIdByNameOrAlias":
            try {
                result = await zhtToolkit.notesTools.getNoteIdByNameOrAlias(params.name);
            }
            catch (error) {
                result = false;
            }
            break;
        default:
            break;
    }
    parentPort.postMessage(result);
};
f();
