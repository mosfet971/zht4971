import { modalWindowsManagerStore } from "../stores/ModalWindowsManagerStore";
import { noteTabStore } from "../stores/tabsStores/NoteTabStore";

let setupGlobalFunctions = () => {
    window.showErrorModal = (v) => {
        modalWindowsManagerStore.open("WindowError", v);
    };

    window.openNoteByName = async (name, semanticDateNumber) => {
        await noteTabStore.openNoteByName(name, semanticDateNumber);
    };

    window.openNoteById = async (id) => {
        await noteTabStore.openNote(id);
    };
};

export { setupGlobalFunctions };