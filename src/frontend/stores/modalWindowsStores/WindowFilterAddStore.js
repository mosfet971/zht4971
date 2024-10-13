import { makeAutoObservable, runInAction } from "mobx";
import { noteTabStore } from "../tabsStores/NoteTabStore";
import { modalWindowsManagerStore } from "../ModalWindowsManagerStore";
import { listTabStore } from "../tabsStores/ListTabStore";

class WindowFilterAddStore {
    constructor() {
        makeAutoObservable(this);
    }

    status = "selectType"; // selectType, settings
    filterType = "";
    filterParams = {};
    paramsList = [];

    reset = async () => {
        this.status = "selectType";
        this.filterType = "";
        this.filterParams = {as: "asd", id: crypto.randomUUID()};
        this.paramsList = [];
    };

    //selectType

    setFilterType = async (filterType) => {
        this.filterType = filterType;
    };

    saveFilterType = async () => {
        // TODO: map type to params
        // TODO: check is type correct
        this.paramsList = [];

        this.status = "settings";
    };

    //settings

    setFilterParam = async (paramName, paramValue) => {
        this.filterParams[paramName] = paramValue;
    };

    save = async () => {
        let filterObject = this.filterParams;
        //TODO: filterParams To filterObject
        listTabStore.addFilter(filterObject);
        modalWindowsManagerStore.close();
    };

}

export const windowFilterAddStore = new WindowFilterAddStore();