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
            "nameOrAliasFilterFuse": this._checkNameOrAliasFuse,
            "noteTypeNumberRangeFilter": this._checkNoteTypeNumberRangeFilter
        }
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
                    notes.push(i)
                }
            }
        } else {
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

        let notesIdsOut = []
        for (const i of notes) {
            notesIdsOut.push(i.id);
        }

        return notesIdsOut;
    };

    _checkParamRange = (noteObject, filterObject) => {
        if (filterObject.paramName == "historicalDateAccuracyLevel_1_2_3") {
            if (!noteObject.hasHistoricalDate) {
                return false;
            }
        }
        if (
            parseInt(noteObject[filterObject.paramName]) >= parseInt(filterObject.minValue)
            && parseInt(noteObject[filterObject.paramName]) <= parseInt(filterObject.maxValue)
        ) {
            return true;
        } else {
            return false;
        }
    };

    _checkParamLengthRange = (noteObject, filterObject) => {
        if (
            noteObject[filterObject.paramName].length >= filterObject.minValue
            && noteObject[filterObject.paramName].length <= filterObject.maxValue
        ) {
            return true;
        } else {
            return false;
        }
    };

    _checkParamIncludesStringStrict = (noteObject, filterObject) => {
        if (
            noteObject[filterObject.paramName].includes(filterObject.value)
        ) {
            return true;
        } else {
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
            }
            const fuse = new Fuse([noteObject], options)
            let result = fuse.search(filterObject.value)[0];
            //console.log(result);
            if (result.score > 0.8) {
                return false;
            }
        } catch (error) {
            //console.log(error);
            return false;
        }
        return true;
    };

    _checkParamBool = (noteObject, filterObject) => {
        try {
            return noteObject[filterObject.paramName] == filterObject.valueBool;
        } catch (error) {
            //console.log(error);
            return false;
        }
        return true;
    };

    _checkStringInList = (noteObject, filterObject) => {
        try {
            return (noteObject[filterObject.paramName]).includes(filterObject.value);
        } catch (error) {
            //console.log(error);
            return false;
        }
        return true;
    };

    //type, paramName, minDateValue, maxDateValue, isInverted
    _checkDateParamRangeFilter = (noteObject, filterObject) => {
        try {
            let minDateStruct = {
                d: parseInt(filterObject.minDateValue.split(".")[0]),
                m: parseInt(filterObject.minDateValue.split(".")[1]),
                y: parseInt(filterObject.minDateValue.split(".")[2])
            };

            let maxDateStruct = {
                d: parseInt(filterObject.maxDateValue.split(".")[0]),
                m: parseInt(filterObject.maxDateValue.split(".")[1]),
                y: parseInt(filterObject.maxDateValue.split(".")[2])
            };

            let noteDateStruct;

            if (filterObject.paramName == "historicalDateNumber") {
                if (!noteObject.hasHistoricalDate) {
                    return false;
                }
                let str = noteObject[filterObject.paramName].toString();
                noteDateStruct = {
                    y: parseInt(str.toString().substring(0, str.length - 4)),
                    m: parseInt(str.toString().substring(str.length - 4, str.length - 2)),
                    d: parseInt(str.toString().substring(str.length - 2, str.length))
                };
            } else {
                let dateObj = new Date(parseInt(noteObject[filterObject.paramName]));
                noteDateStruct = {
                    y: dateObj.getFullYear(),
                    m: dateObj.getMonth(),
                    d: dateObj.getDay()
                }
            }

            let noteDateNumber = parseInt(noteDateStruct.y.toString().padStart(4, "0") + noteDateStruct.m.toString().padStart(2, "0") + noteDateStruct.d.toString().padStart(2, "0"));
            let minDateNumber = parseInt(minDateStruct.y.toString().padStart(4, "0") + minDateStruct.m.toString().padStart(2, "0") + minDateStruct.d.toString().padStart(2, "0"));
            let maxDateNumber = parseInt(maxDateStruct.y.toString().padStart(4, "0") + maxDateStruct.m.toString().padStart(2, "0") + maxDateStruct.d.toString().padStart(2, "0"));

            let isDateInRange = noteDateNumber >= minDateNumber && noteDateNumber <= maxDateNumber;

            if (isDateInRange) {
                return true;
            } else {
                return false;
            }

        } catch (error) {
            return false;
        }
        return true;
    };

    _checkNameOrAliasFuse = (noteObject, filterObject) => {
        return (
            this._checkParamIncludesStringFuse(noteObject, { type: "stringFuse", paramName: "name", value: filterObject.value, isInverted: filterObject.isInverted })
            ||
            this._checkParamIncludesStringFuse(noteObject, { type: "stringFuse", paramName: "aliasesList", value: filterObject.value, isInverted: filterObject.isInverted })
        );
    };

    _checkNoteTypeNumberRangeFilter = (noteObject, filterObject) => {
        if (!noteObject.hasOwnProperty("noteTypeNumber")) {
            return false;
        }
        if (
            parseInt(noteObject["noteTypeNumber"]) >= filterObject.minNoteTypeNumberValue
            && parseInt(noteObject["noteTypeNumber"]) <= filterObject.maxNoteTypeNumberValue
        ) {
            return true;
        } else {
            return false;
        }
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

    addNoteTypeNumberRangeFilter = (filtersList, minNoteTypeNumberValue, maxNoteTypeNumberValue, isInverted) => {
        let list = filtersList;
        let type = "noteTypeNumberRangeFilter";
        list.push({ type, minNoteTypeNumberValue, maxNoteTypeNumberValue, isInverted });
        return list;
    };
}

export default NotesSearchTools;