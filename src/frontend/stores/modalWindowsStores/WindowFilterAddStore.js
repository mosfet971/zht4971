import { autorun, makeAutoObservable, reaction, runInAction } from "mobx";
import { noteTabStore } from "../tabsStores/NoteTabStore";
import { modalWindowsManagerStore } from "../ModalWindowsManagerStore";
import { listTabStore } from "../tabsStores/ListTabStore";
import { IconArrowRightSquare } from "@tabler/icons-react";

class WindowFilterAddStore {
    constructor() {
        makeAutoObservable(this);

        reaction(() => this.filterType, () => {
            this.filterObject = {};
            for (const i of this.filterTypeToFilterParamsMap[this.filterType]) {
                if (i == "type") {
                    this.setFilterObjectParam(i, this.filterType);
                } else if (i == "paramName") {
                    this.setFilterObjectParam(i, this.filterTypeToActualNoteParamsMap[this.filterType][0]);
                } else {
                    this.setFilterObjectParam(i, this.filterParamsToDefaultVals[i]);
                }
            }
        });
    }

    status = "settings"; // settings, error

    filterType = "nameOrAliasFilterFuse";

    filterObject = {};

    filterTypeToFilterParamsMap = {
        "nameOrAliasFilterFuse": ["type", "value", "isInverted"],
        "range": ["type", "paramName", "minValue", "maxValue", "isInverted"],
        "rangeLength": ["type", "paramName", "minValue", "maxValue", "isInverted"],
        "stringStrict": ["type", "paramName", "value", "isInverted"],
        "stringFuse": ["type", "paramName", "value", "isInverted"],
        "bool": ["type", "paramName", "valueBool", "isInverted"],
        "stringInList": ["type", "paramName", "value", "isInverted"],
        "ddmmggggFilter": ["type", "paramName", "minDateValue", "maxDateValue", "isInverted"],
        "noteTypeNumberRangeFilter": ["type", "minNoteTypeNumberValue", "maxNoteTypeNumberValue", "isInverted"]
    };
    filterTypeToActualNoteParamsMap = {
        "nameOrAliasFilterFuse": [],
        "range": ["historicalDateAccuracyLevel_1_2_3", "noteTypeNumber"],
        "rangeLength": ["name", "aliasesList", "sourceText", "associatedNotesIds"],
        "stringStrict": ["name", "sourceText", "id", "aliasesList"],
        "stringFuse": ["name", "sourceText", "id", "aliasesList", "associatedNotesIds"],
        "bool": ["isPrimary", "hasHistoricalDate"],
        "stringInList": ["aliasesList", "associatedNotesIds"],
        "ddmmggggFilter": ["historicalDateNumber", "lastGetTime", "creationTime", "editionTime"],
        "noteTypeNumberRangeFilter": []
    };
    filterTypeToDisplayTextMap = {
        "nameOrAliasFilterFuse": "Нечеткое влючение текста в названии или псевдонимах",
        "stringFuse": "Нечеткое включение текста в текстовом параметре или списке",
        "stringStrict": "Включение текста в текстовом параметре или списке",
        "stringInList": "Включение текста в списке",
        "range": "Диапазон числового значения параметра",
        "rangeLength": "Диапазон длинны текстового значения или списка",
        "bool": "Логическое значение",
        "ddmmggggFilter": "Диапозон даты в формате дд.мм.гггг",
        "noteTypeNumberRangeFilter": "Диапазон типов"
    };
    noteParamToDisplayTextMap = {
        "id": "Идентификатор",
        "name": "Название",
        "aliasesList": "Список псевдонимов",
        "isPrimary": "Избранность",
        "noteTypeNumber": "Тип записи в виде числа",
        "tagsNotesListIds": "",
        "lastGetTime": "Время предыдущего открытия ",
        "creationTime": "Время создания",
        "editionTime": "Время изменения",
        "hasHistoricalDate": "Наличие дополнительной даты",
        "historicalDateNumber": "Дополнительная дата",
        "historicalDateAccuracyLevel_1_2_3": "Уровень точности дополнительной даты (1, 2, 3)",
        "sourceText": "Исходный текст записи",
        "taggedNotesIds": "",
        "associatedNotesIds": "Список ассоциированных записей (названия и псевдонимы)"
    };

    filterParamsToDefaultVals = {
        "type": "-",
        "paramName": "-",
        "minValue": "1",
        "maxValue": "1",
        "isInverted": false,
        "value": "",
        "minDateValue": "",
        "maxDateValue": "",
        "minNoteTypeNumberValue": 0,
        "maxNoteTypeNumberValue": 3
    };

    reset = async () => {
        this.status = "settings"; // settings, error

        this.filterType = "nameOrAliasFilterFuse";
        this.filterObject = {};
        for (const i of this.filterTypeToFilterParamsMap[this.filterType]) {
            if (i == "type") {
                this.setFilterObjectParam(i, this.filterType);
            } else if (i == "paramName") {
                this.setFilterObjectParam(i, this.filterTypeToActualNoteParamsMap[this.filterType][0]);
            } else {
                this.setFilterObjectParam(i, this.filterParamsToDefaultVals[i]);
            }
        }
    };

    //settings
    setFilterType = async (filterType) => {
        this.filterType = filterType;
    };

    get actualFilterParamsList() {
        return this.filterTypeToFilterParamsMap[this.filterType];
    }

    get actualNoteParamsList() {
        return this.filterTypeToActualNoteParamsMap[this.filterType];
    }

    setFilterObjectParam = (paramName, paramValue) => {
        this.filterObject[paramName] = paramValue;
    };

    save = async () => {
        let filterObjectFinal = this.filterObject;

        if (filterObjectFinal.type == "ddmmggggFilter") {
            let checkValid = (v) => (v
                .replaceAll(/[0-9]{2}\.[0-9]{2}\.[0-9]{4}/g, "date_marker")
                .includes("date_marker")
            );
            if (!checkValid(filterObjectFinal.minDateValue)) { this.status = "error"; return; }
            if (!checkValid(filterObjectFinal.maxDateValue)) { this.status = "error"; return; }
        }

        if (filterObjectFinal.hasOwnProperty("paramName")) {
            if (filterObjectFinal.paramName == "associatedNotesIds" && filterObjectFinal.hasOwnProperty("value")) {
                //console.log(this.filterObject)
                let resolvedId = await ipcRenderer.invoke("getNoteIdByNameOrAlias", filterObjectFinal.value);
                if (resolvedId) {
                    filterObjectFinal.value = resolvedId;
                } else {
                    this.status = "error";
                    return;
                }
            }
        }

        listTabStore.addFilter(filterObjectFinal);
        modalWindowsManagerStore.close();
    };

}

export const windowFilterAddStore = new WindowFilterAddStore();