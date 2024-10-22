import Fuse from 'fuse.js';
class NotesSearchTools {
    constructor(notesTools) {
        this.notesTools = notesTools;
        this.types = {
            "range": this._checkParamRange,
            "rangeLength": this._checkParamLengthRange,
            "stringStrict": this._checkParamIncludesStringStrict,
            "stringFuse": this._checkParamIncludesStringFuse,
            "bool": this._checkParamBool,
            "stringInList": this._checkStringInList,
            "ddmmggggFilter": this._checkDateParamRangeFilter,
            "nameOrAliasFilterFuse": this._checkNameOrAliasFuse
        };
    }
    getListOfNotesIdsSortedByParamWithFilters = (paramName, filtersList, isNeedInvertedOrderList) => {
        let notesIds = this.notesTools.getListOfIds();
        //console.log(notesIds);
        let notes0 = [];
        for (const i of notesIds) {
            notes0.push(this.notesTools.get(i));
        }
        let notes;
        if (paramName == "historicalDateNumber") {
            notes = [];
            for (const i of notes0) {
                if (i.hasHistoricalDate) {
                    notes.push(i);
                }
            }
        }
        else {
            notes = notes0;
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
        if (parseInt(noteObject[filterObject.paramName]) >= filterObject.minValue
            && parseInt(noteObject[filterObject.paramName]) <= filterObject.maxValue) {
            return true;
        }
        else {
            return false;
        }
    };
    _checkParamLengthRange = (noteObject, filterObject) => {
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
            return noteObject[filterObject.paramName] == filterObject.valueBool;
        }
        catch (error) {
            //console.log(error);
            return false;
        }
        return true;
    };
    _checkStringInList = (noteObject, filterObject) => {
        try {
            return (noteObject[filterObject.paramName]).includes(filterObject.value);
        }
        catch (error) {
            //console.log(error);
            return false;
        }
        return true;
    };
    //type, paramName, minDateValue, maxDateValue, isInverted
    _checkDateParamRangeFilter = (noteObject, filterObject) => {
        let checkValid = (v) => (v
            .replaceAll(/[0-9]{2}\.[0-9]{2}\.[0-9]{4}/g, "date_marker")
            .includes("date_marker"));
        if (!checkValid(filterObject.minDateValue))
            return false;
        if (!checkValid(filterObject.maxDateValue))
            return false;
        let minDateStruct = {
            d: filterObject.minDateValue.split(".")[0],
            m: filterObject.minDateValue.split(".")[1],
            y: filterObject.minDateValue.split(".")[2]
        };
        let maxDateStruct = {
            d: filterObject.maxDateValue.split(".")[0],
            m: filterObject.maxDateValue.split(".")[1],
            y: filterObject.maxDateValue.split(".")[2]
        };
        let noteDateStruct;
        try {
            if (filterObject.paramName == "historicalDateNumber") {
                if (!noteObject.hasHistoricalTime) {
                    return false;
                }
                noteDateStruct = {
                    y: parseInt(noteObject[filterObject.paramName].toString().substring(0, str.length - 4)),
                    m: parseInt(noteObject[filterObject.paramName].toString().substring(str.length - 4, str.length - 2)),
                    d: parseInt(noteObject[filterObject.paramName].toString().substring(str.length - 2, str.length))
                };
            }
            else {
                let dateObj = new Date(parseInt(noteObject[filterObject.paramName]));
                noteDateStruct = {
                    y: dateObj.getFullYear(),
                    m: dateObj.getMonth(),
                    d: dateObj.getDay()
                };
            }
            let isYearInRange = (noteDateStruct.y >= minDateStruct.y) && (noteDateStruct.y <= maxDateStruct.y);
            let isMonthInRange = (noteDateStruct.m >= minDateStruct.m) && (noteDateStruct.m <= maxDateStruct.m);
            let isDayInRange = (noteDateStruct.d >= minDateStruct.d) && (noteDateStruct.d <= maxDateStruct.d);
            let isDateInRange = isYearInRange && isMonthInRange && isDayInRange;
            if (isDateInRange) {
                return true;
            }
        }
        catch (error) {
            return false;
        }
        return true;
    };
    _checkNameOrAliasFuse = (noteObject, filterObject) => {
        return (this._checkParamIncludesStringFuse(noteObject, { type: "stringFuse", paramName: "name", value: filterObject.value, isInverted: filterObject.isInverted })
            ||
                this._checkParamIncludesStringFuse(noteObject, { type: "stringFuse", paramName: "aliasesList", value: filterObject.value, isInverted: filterObject.isInverted }));
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
    addParamLengthFilter = (filtersList, paramName, minValue, maxValue, isInverted) => {
        let list = filtersList;
        let type = "rangeLength";
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
    addPramBoolFilter = (filtersList, paramName, valueBool, isInverted) => {
        let list = filtersList;
        let type = "bool";
        list.push({ type, paramName, valueBool, isInverted });
        return list;
    };
    addPramIncludesStringInListFilter = (filtersList, paramName, value, isInverted) => {
        let list = filtersList;
        let type = "stringInList";
        list.push({ type, paramName, value, isInverted });
        return list;
    };
    addDateParamRangeFilter = (filtersList, paramName, minDateValue, maxDateValue, isInverted) => {
        let list = filtersList;
        let type = "ddmmggggFilter";
        list.push({ type, paramName, minDateValue, maxDateValue, isInverted });
        return list;
    };
    addFuseNoteNameOrAliasIncludeFilter = (filtersList, value, isInverted) => {
        let list = filtersList;
        let type = "nameOrAliasFilterFuse";
        list.push({ type, value, isInverted });
        return list;
    };
}
export default NotesSearchTools;
