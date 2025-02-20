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
        "ddmmggggFilter": ["type", "paramName", "minDateValue", "maxDateValue", "isInverted"]
    };
    filterTypeToActualNoteParamsMap = {
        "nameOrAliasFilterFuse": [],
        "range": ["historicalDateAccuracyLevel_1_2_3", "noteTypeNumber"],
        "rangeLength": ["name", "aliasesList", "sourceText"],
        "stringStrict": ["name", "sourceText", "id", "aliasesList"],
        "stringFuse": ["name", "sourceText", "id", "aliasesList"],
        "bool": ["isPrimary", "hasHistoricalDate"],
        "stringInList": ["aliasesList"],
        "ddmmggggFilter": ["historicalDateNumber", "lastGetTime", "creationTime", "editionTime"],
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
        "hasHistoricalDate": "Наличие семантической даты",
        "historicalDateNumber": "Семантическая дата",
        "historicalDateAccuracyLevel_1_2_3": "Уровень точности семантической даты (1, 2, 3)",
        "sourceText": "Исходный текст записи",
        "taggedNotesIds": "",
    };

    filterParamsToDefaultVals = {
        "type": "-",
        "paramName": "-",
        "minValue": "1",
        "maxValue": "1",
        "isInverted": false,
        "value": "",
        "valueBool": false,
        "minDateValue": "",
        "maxDateValue": "",
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
                let resolvedId = await ipcRenderer.invoke("getNoteIdByNameOrAlias", {name: filterObjectFinal.value, semanticDateNumber: parseInt((new Date()).getFullYear().toString() + ((new Date()).getMonth() + 1).toString().padStart(2, "0") + (new Date()).getDate().toString().padStart(2, "0"))});
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