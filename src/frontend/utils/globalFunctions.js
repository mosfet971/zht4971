import { modalWindowsManagerStore } from "../stores/ModalWindowsManagerStore";

let setupGlobalFunctions = () => {
    window.showErrorModal = (v) => {
        modalWindowsManagerStore.open("WindowError", v);
    };
};

export { setupGlobalFunctions };