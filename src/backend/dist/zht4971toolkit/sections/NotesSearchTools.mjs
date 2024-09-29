import Fuse from 'fuse.js';
class NotesSearchTools {
    constructor(notesTools) {
        this.notesTools = notesTools;
        this.types = {
            "range": this._checkParamRange,
            "rangeStringLength": this._checkStringParamLengthRange,
            "stringStrict": this._checkParamIncludesStringStrict,
            "stringFuse": this._checkParamIncludesStringFuse,
            "bool": this._checkParamBool
        };
    }
    getListOfNotesIdsSortedByParamWithFilters = (paramName, filtersList, isNeedInvertedOrderList) => {
        let notesIds = this.notesTools.getListOfIds();
        //console.log(notesIds);
        let notes = [];
        for (const i of notesIds) {
            notes.push(this.notesTools.get(i));
        }
        notes = notes.sort((a, b) => {
            return !isNeedInvertedOrderList ? a[paramName] - b[paramName] : b[paramName] - a[paramName];
        });
        for (const i of filtersList) {
            notes = notes.filter((v) => {
                return i.isInverted ? !(this.types[i.type](v, i)) : (this.types[i.type](v, i));
            });
        }
        let notesIdsOut = [];
        for (const i of notes) {
            notesIdsOut.push(i.id);
        }
        return notesIdsOut;
    };
    _checkParamRange = (noteObject, filterObject) => {
        if (filterObject.paramName == "historicalTime" || filterObject.paramName == "historicalTimeAccuracyLevel_1_2_3") {
            if (!noteObject.hasHistoricalTime) {
                return false;
            }
        }
        if (parseInt(noteObject[filterObject.paramName]) >= filterObject.minValue
            && parseInt(noteObject[filterObject.paramName]) <= filterObject.maxValue) {
            return true;
        }
        else {
            return false;
        }
    };
    _checkStringParamLengthRange = (noteObject, filterObject) => {
        if (noteObject[filterObject.paramName].length >= filterObject.minValue
            && noteObject[filterObject.paramName].length <= filterObject.maxValue) {
            return true;
        }
        else {
            return false;
        }
    };
    _checkParamIncludesStringStrict = (noteObject, filterObject) => {
        if (noteObject[filterObject.paramName].includes(filterObject.value)) {
            return true;
        }
        else {
            let isIncludes = false;
            for (const i of noteObject[filterObject.paramName]) {
                if (i.includes) {
                    isIncludes = i.includes(filterObject.value);
                }
            }
            return isIncludes;
        }
    };
    _checkParamIncludesStringFuse = (noteObject, filterObject) => {
        try {
            const options = {
                includeScore: true,
                keys: [filterObject.paramName],
                ignoreLocation: true
            };
            const fuse = new Fuse([noteObject], options);
            let result = fuse.search(filterObject.value)[0];
            //console.log(result);
            if (result.score > 0.8) {
                return false;
            }
        }
        catch (error) {
            //console.log(error);
            return false;
        }
        return true;
    };
    _checkParamBool = (noteObject, filterObject) => {
        try {
            return noteObject[filterObject.paramName] == filterObject.value;
        }
        catch (error) {
            //console.log(error);
            return false;
        }
        return true;
    };
    creteBlankFiltersList = () => {
        return ([]);
    };
    addNumberParamRangeFilter = (filtersList, paramName, minValue, maxValue, isInverted) => {
        let list = filtersList;
        let type = "range";
        list.push({ type, paramName, minValue, maxValue, isInverted });
        return list;
    };
    addStringParamLengthFilter = (filtersList, paramName, minValue, maxValue, isInverted) => {
        let list = filtersList;
        let type = "rangeStringLength";
        list.push({ type, paramName, minValue, maxValue, isInverted });
        return list;
    };
    addPramIncludesStringStrictFilter = (filtersList, paramName, value, isInverted) => {
        let list = filtersList;
        let type = "stringStrict";
        list.push({ type, paramName, value, isInverted });
        return list;
    };
    addPramIncludesStringFuseFilter = (filtersList, paramName, value, isInverted) => {
        let list = filtersList;
        let type = "stringFuse";
        list.push({ type, paramName, value, isInverted });
        return list;
    };
    addPramBoolFilter = (filtersList, paramName, value, isInverted) => {
        let list = filtersList;
        let type = "bool";
        list.push({ type, paramName, value, isInverted });
        return list;
    };
}
export default NotesSearchTools;
