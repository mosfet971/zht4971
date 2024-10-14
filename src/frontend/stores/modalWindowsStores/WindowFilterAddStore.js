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

    saveFilterType = async () => {
        let filterTypeToFilterParamsMap = {
            "range": ["type", "paramName", "minValue", "maxValue", "isInverted"],
            "rangeStringLength": ["type", "paramName", "minValue", "maxValue", "isInverted"],
            "stringStrict": ["type", "paramName", "value", "isInverted"],
            "stringFuse": ["type", "paramName", "value", "isInverted"],
            "bool": ["type", "paramName", "value", "isInverted"],
            "stringInList": ["type", "paramName", "value", "isInverted"]
        };
        let filterTypeToActualNoteParamsMap = {
            "range": [],
            "rangeStringLength": [],
            "stringStrict": [],
            "stringFuse": [],
            "bool": [],
            "stringInList": []
        };

        //TODO: maps to display text and input type
        
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