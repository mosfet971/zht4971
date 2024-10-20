import { makeAutoObservable, runInAction } from "mobx";
import { noteTabStore } from "../tabsStores/NoteTabStore";
import { modalWindowsManagerStore } from "../ModalWindowsManagerStore";
import { listTabStore } from "../tabsStores/ListTabStore";

class WindowFilterAddStore {
    constructor() {
        makeAutoObservable(this);
    }

    status = "selectType"; // selectType, settings, error

    filterType = "stringFuse";
    actualFilterParamsList = [];
    filterObject = {};

    actualNoteParamsList = [];

    filterTypeToFilterParamsMap = {
        "range": ["type", "paramName", "minValue", "maxValue", "isInverted"],
        "rangeLength": ["type", "paramName", "minValue", "maxValue", "isInverted"],
        "stringStrict": ["type", "paramName", "value", "isInverted"],
        "stringFuse": ["type", "paramName", "value", "isInverted"],
        "bool": ["type", "paramName", "value", "isInverted"],
        "stringInList": ["type", "paramName", "value", "isInverted"],
        "ddmmggggFilter": ["type", "paramName", "minDateValue", "maxDateValue", "isInverted"],
    };

    filterTypeToActualNoteParamsMap = {
        "range": ["noteTypeNumber", "historicalDateAccuracyLevel_1_2_3"],
        "rangeLength": ["name", "aliasesList", "sourceText", "associatedNotesIds"],
        "stringStrict": ["id", "name", "sourceText"],
        "stringFuse": ["id", "name", "sourceText"],
        "bool": ["isPrimary", "hasHistoricalDate"],
        "stringInList": ["aliasesList", "associatedNotesIds"],
        "ddmmggggFilter": ["lastGetTime", "creationTime", "editionTime", "historicalDateNumber"]
    };
    filterTypeToDisplayTextMap = {
        "stringFuse": "Нечеткое включение текстового значения",
        "range": "Диапазон",
        "rangeLength": "Диапазон длинны текстового значения",
        "stringStrict": "Включение текстового значения",
        "bool": "Логическое значение",
        "stringInList": "Наличие элемента в списке",
        "ddmmggggFilter": "Дата в формате дд.мм.гггг (например: 01.01.2001)"
    };
    noteParamToDisplayTextMap = {
        "id": "Идентификатор",
        "name": "Название",
        "aliasesList": "Список псевдонимов",
        "isPrimary": "Избранность",
        "noteTypeNumber": "Числовой тип записи",
        "tagsNotesListIds": "",
        "lastGetTime": "Время предыдущего открытия ",
        "creationTime": "Время создания",
        "editionTime": "Время изменения",
        "hasHistoricalDate": "Наличие дополнительной даты",
        "historicalDateNumber": "Дополнительная дата", // 1970 01 01
        "historicalDateAccuracyLevel_1_2_3": "Уровень точности дополнительной даты (1, 2, 3)",
        "sourceText": "Исходный текст записи",
        "taggedNotesIds": "",
        "associatedNotesIds": "Список ассоциированных записей"
    };

    filterParamToDisplayTextMap = {
        "type": "Тип фильтра",
        "paramName": "Параметр записи",
        "minValue": "Минимальное числовое значение",
        "maxValue": "Максимальное числовое значение",
        "isInverted": "Инверсия",
        "value": "Текстовое значение",
        "minDateValue": "Минимальная дата",
        "minDateValue": "Максимальная дата",
    };

    filterParamsToDefaultVals = {
        "type": "-",
        "paramName": "-",
        "minValue": 0,
        "maxValue": 100,
        "isInverted": false,
        "value": "",
        "minDateValue": "01.01.2001",
        "maxDateValue": "12.12.2007",
    };

    reset = async () => {
        this.status = "selectType"; // selectType, settings, error

        this.filterType = "stringFuse";
        this.actualFilterParamsList = [];
        this.filterObject = {};

        this.actualNoteParamsList = [];
    };

    //selectType

    setFilterType = async (filterType) => {
        this.filterType = filterType;
    };

    saveFilterType = () => {

        if (
            this.filterTypeToFilterParamsMap.hasOwnProperty(this.filterType)
            && this.filterTypeToActualNoteParamsMap.hasOwnProperty(this.filterType)
        ) {
            this.actualFilterParamsList = this.filterTypeToFilterParamsMap[this.filterType];
            this.actualNoteParamsList = this.filterTypeToActualNoteParamsMap[this.filterType]

            for (const i of this.filterTypeToFilterParamsMap[this.filterType]) {
                if (i == "type") {
                    this.setFilterObjectParam(i, this.filterType);
                } else if (i == "paramName") {
                    this.setFilterObjectParam(i, this.filterTypeToActualNoteParamsMap[this.filterType][0]);
                } else {
                    this.setFilterObjectParam(i, this.filterParamsToDefaultVals[i]);
                }
            }

            this.status = "settings";
        } else {
            this.status = "error";
        }
    };

    //settings

    setFilterObjectParam = (paramName, paramValue) => {
        this.filterObject[paramName] = paramValue;
    };

    save = async () => {
        let filterObjectFinal = this.filterObject;
        //TODO: filterObject To filterObjectFinal
        listTabStore.addFilter(filterObjectFinal);
        modalWindowsManagerStore.close();
    };

}

export const windowFilterAddStore = new WindowFilterAddStore();