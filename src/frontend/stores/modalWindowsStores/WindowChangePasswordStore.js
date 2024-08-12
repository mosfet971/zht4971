import { makeAutoObservable, runInAction } from "mobx";

class WindowChangePasswordStore {
    constructor() {
        makeAutoObservable(this);
    }

    status = "ready"; // ready, loading, finished, error

    oldPassword = "";
    newPasswod = "";

    reset = async () => {
        this.status = "ready";
        this.oldPassword = "";
        this.newPasswod = "";
    };

    oldPasswordInputHandler = async (e) => {
        this.oldPassword = e.target.value;
    };

    newPasswordInputHandler = async (e) => {
        this.newPassword = e.target.value;
    };

    submit = async () => {
        runInAction(()=>{this.status = "loading";});
        if(await ipcRenderer.invoke("changePassword", {
            oldPassword: this.oldPassword,
            newPassword: this.newPassword
        })) {
            runInAction(()=>{this.status = "finished";});
        } else {
            runInAction(()=>{this.status = "error";});
        }
        
    }
    
}

export const windowChangePasswordStore = new WindowChangePasswordStore();