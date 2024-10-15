import { makeAutoObservable, runInAction } from "mobx";
import { noteTabStore } from "../tabsStores/NoteTabStore";
import { modalWindowsManagerStore } from "../ModalWindowsManagerStore";
import { listTabStore } from "../tabsStores/ListTabStore";

class WindowFilterAddStore {
    constructor() {
        makeAutoObservable(this);
    }

    status = "selectType"; // selectType, settings, error
    
    filterType = "";
    filterParamsList = [];
    filterObject = {};

    actualNoteParamsList = [];

    reset = async () => {
        this.status = "selectType"; // selectType, settings, error
    
        this.filterType = "";
        this.filterParamsList = [];
        this.filterObject = { as: "asd", id: crypto.randomUUID() };
    
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
    saveFilterType = async () => {
        let filterTypeToFilterParamsMap = {
            "range": ["type", "paramName", "minValue", "maxValue", "isInverted"],
            "rangeLength": ["type", "paramName", "minValue", "maxValue", "isInverted"],
            "stringStrict": ["type", "paramName", "value", "isInverted"],
            "stringFuse": ["type", "paramName", "value", "isInverted"],
            "bool": ["type", "paramName", "value", "isInverted"],
            "stringInList": ["type", "paramName", "value", "isInverted"]
        };
        let filterTypeToActualNoteParamsMap = {
            "range": ["noteTypeNumber", "lastGetTime", "creationTime", "editionTime", "historicalDateNumber", "historicalDateAccuracyLevel_1_2_3"],
            "rangeLength": ["name", "aliasesList", "sourceText", "associatedNotesIds"],
            "stringStrict": ["id", "name", "sourceText"],
            "stringFuse": ["id", "name", "sourceText"],
            "bool": ["isPrimary", "hasHistoricalDate"],
            "stringInList": ["aliasesList", "associatedNotesIds"]
        };
        let filterTypeToDisplayTextMap = {
            "range": "Диапазон",
            "rangeLength": "Диапазон длинны текстового значения",
            "stringStrict": "Четкое текстовое значение",
            "stringFuse": "Нечеткое текстовое значение",
            "bool": "Логическое значение",
            "stringInList": "Наличие элемента в списке"
        };
        let noteParamToDisplayTextMap = {
            "id": "Идентификатор",
            "name": "Название",
            "aliasesList": "Список псевдонимов",
            "isPrimary": "Избранность",
            "noteTypeNumber": "Числовой тип записи",
            "tagsNotesListIds": "",
            "lastGetTime": "Время предыдущего открытия",
            "creationTime": "Время создания",
            "editionTime": "Время изменения",
            "hasHistoricalDate": "Наличие дополнительной даты",
            "historicalDateNumber": "Дополнительная дата в формате ггггммдд (напр. 19700101)", // 1970 01 01
            "historicalDateAccuracyLevel_1_2_3": "Уровень точности дополнительной даты (1, 2, 3)",
            "sourceText": "Исходный текст записи",
            "taggedNotesIds": "",
            "associatedNotesIds": "Список ассоциированных записей"
        };

        let filterTypeToInputTypeMap = {
            "range": "range_inp",
            "rangeLength": "range_inp",
            "stringStrict": "string_inp",
            "stringFuse": "string_inp",
            "bool": "bool_inp",
            "stringInList": "string_inp"
        };
        
        if (
            filterTypeToFilterParamsMap.hasOwnProperty(this.filterType) 
            && filterTypeToFilterParamsMap.hasOwnProperty(this.filterType)
        ) {
            this.filterParams = filterTypeToFilterParamsMap[this.filterType];
            this.actualNoteParamsList = filterTypeToActualNoteParamsMap[this.filterType]
            // TODO: init filter object
            this.status = "settings";
        } else {
            this.status = "error";
        }
    };

    //settings

    setFilterObjectParam = async (paramName, paramValue) => {
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