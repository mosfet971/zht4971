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
        "stringInList": ["type", "paramName", "value", "isInverted"]
    };
    filterTypeToActualNoteParamsMap = {
        "range": ["noteTypeNumber", "lastGetTime", "creationTime", "editionTime", "historicalDateNumber", "historicalDateAccuracyLevel_1_2_3"],
        "rangeLength": ["name", "aliasesList", "sourceText", "associatedNotesIds"],
        "stringStrict": ["id", "name", "sourceText"],
        "stringFuse": ["id", "name", "sourceText"],
        "bool": ["isPrimary", "hasHistoricalDate"],
        "stringInList": ["aliasesList", "associatedNotesIds"]
    };
    filterTypeToDisplayTextMap = {
        "stringFuse": "Нечеткое текстовое значение",
        "range": "Диапазон",
        "rangeLength": "Диапазон длинны текстового значения",
        "stringStrict": "Четкое текстовое значение",
        "bool": "Логическое значение",
        "stringInList": "Наличие элемента в списке"
    };
    noteParamToDisplayTextMap = {
        "id": "Идентификатор",
        "name": "Название",
        "aliasesList": "Список псевдонимов",
        "isPrimary": "Избранность",
        "noteTypeNumber": "Числовой тип записи",
        "tagsNotesListIds": "",
        "lastGetTime": "Время предыдущего открытия (в формате unix time)",
        "creationTime": "Время создания (в формате unix time)",
        "editionTime": "Время изменения (в формате unix time)",
        "hasHistoricalDate": "Наличие дополнительной даты",
        "historicalDateNumber": "Дополнительная дата в формате ггггммдд (напр. 19700101)", // 1970 01 01
        "historicalDateAccuracyLevel_1_2_3": "Уровень точности дополнительной даты (1, 2, 3)",
        "sourceText": "Исходный текст записи",
        "taggedNotesIds": "",
        "associatedNotesIds": "Список ассоциированных записей"
    };
    filterTypeToInputTypeMap = {
        "range": "range_inp",
        "rangeLength": "range_inp",
        "stringStrict": "string_inp",
        "stringFuse": "string_inp",
        "bool": "bool_inp",
        "stringInList": "string_inp"
    };

    filterParamToDisplayTextMap = {
        "type": "Тип фильтра",
        "paramName": "Параметр записи",
        "minValue": "Минимальное числовое значение",
        "maxValue": "Максимальное числовое значение",
        "isInverted": "Инверсия",
        "value": "Текстовое значение"
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
    /*
        {
            id: id,
            name: "Новая запись " + id,
            aliasesList: [],
            isPrimary: false,
            noteTypeNumber: 0,
            tagsNotesListIds: [],
            lastGetTime: Date.now(),
            creationTime: Date.now(),
            editionTime: Date.now(),
            hasHistoricalDate: false,
            historicalDateNumber: 19700101, // 1970 01 01
            historicalDateAccuracyLevel_1_2_3: 3,
            sourceText: "Текст новой записи",
            taggedNotesIds: [],
            associatedNotesIds: []
        }
        */
    saveFilterType = () => {

        if (
            this.filterTypeToFilterParamsMap.hasOwnProperty(this.filterType)
            && this.filterTypeToActualNoteParamsMap.hasOwnProperty(this.filterType)
        ) {
            this.actualFilterParamsList = this.filterTypeToFilterParamsMap[this.filterType];
            this.actualNoteParamsList = this.filterTypeToActualNoteParamsMap[this.filterType]


            for (const i of this.filterTypeToFilterParamsMap[this.filterType]) {
                switch (i) {
                    case "type":
                        this.setFilterObjectParam(i, this.filterType);
                        break;
                    case "paramName":
                        this.setFilterObjectParam(i, this.filterTypeToActualNoteParamsMap[this.filterType][0]);
                        break;
                    case "minValue":
                        this.setFilterObjectParam(i, 0);
                        break;
                    case "maxValue":
                        this.setFilterObjectParam(i, 100);
                        break;
                    case "isInverted":
                        this.setFilterObjectParam(i, false);
                        break;
                    case "value":
                        this.setFilterObjectParam(i, "");
                        break;
                    default:
                        break;
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