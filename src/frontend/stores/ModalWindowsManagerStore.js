import { makeAutoObservable } from "mobx";

class ModalWindowsManagerStore {
    constructor() {
        makeAutoObservable(this);
    }

    isOpened = false;
    type = "-";
    value = "";

    close = () => {
        this.isOpened = false;
        this.type = "-";
        this.value = "";
    };

    open = (type, value = "") => {
        this.isOpened = true;
        this.type = type;
        this.value = value;
    };
}

export const modalWindowsManagerStore = new ModalWindowsManagerStore();