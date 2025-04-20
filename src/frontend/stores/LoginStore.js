import { makeAutoObservable } from "mobx";
import { modalWindowsManagerStore } from "./ModalWindowsManagerStore";
import { runInAction } from "mobx";

class LoginStore {
    constructor() {
        makeAutoObservable(this);
    }

    isLogined = false;
    password = "";
    status = "ready"; // loading, ready 

    reset = async () => {
        document.getElementById("passwordInput").focus();
    };

    login = async () => {
        await runInAction(() => { this.status = "loading" });
        let isOk = await ipcRenderer.invoke("login", this.password);
        await runInAction(() => { this.status = "ready" });

        if (isOk) {
            this.isLogined = true;
            modalWindowsManagerStore.close();
        } else {
            this.isLogined = false;
            modalWindowsManagerStore.open("WindowLoginError");
        }
    };

    updatePassword = (password) => {
        this.password = password;
        modalWindowsManagerStore.close();
    };
}

export const loginStore = new LoginStore();