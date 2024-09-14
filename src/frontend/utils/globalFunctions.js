import { modalWindowsManagerStore } from "../stores/ModalWindowsManagerStore";
import { noteTabStore } from "../stores/tabsStores/NoteTabStore";

let setupGlobalFunctions = () => {
    window.showErrorModal = (v) => {
        modalWindowsManagerStore.open("WindowError", v);
    };

    window.openNoteByName = async (name) => {
        await noteTabStore.openNoteByName(name);
    };
};

export { setupGlobalFunctions };