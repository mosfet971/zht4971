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
            let objs = await zhtToolkit.notesSearchTools.getListOfNotesIdsSortedByParamWithFilters(paramName, filters, isNeedInvertedOrderList);
            result = objs;
            break;
        default:
            break;
    }
    parentPort.postMessage(result);
};
f();
