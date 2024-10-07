import { makeAutoObservable, runInAction } from "mobx";
import { noteTabStore } from "../tabsStores/NoteTabStore";
import { modalWindowsManagerStore } from "../ModalWindowsManagerStore";

class WindowFilterAddStore {
    constructor() {
        makeAutoObservable(this);
    }

    status = "selectType"; // selectType, settings, finished

    reset = async () => {
        status = "selectType";
    };

}

export const windowFilterAddStore = new WindowFilterAddStore();