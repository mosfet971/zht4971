import { modalWindowsManagerStore } from "../stores/ModalWindowsManagerStore";
import { noteTabStore } from "../stores/tabsStores/NoteTabStore";

let setupGlobalFunctions = () => {
    window.showErrorModal = (v) => {
        modalWindowsManagerStore.open("WindowError", v);
    };

    window.openNoteByName = async (name) => {
        let resolvedId = await ipcRenderer.invoke("getNoteIdByNameOrAlias", name);
        if (resolvedId) {
            await noteTabStore.openNote(resolvedId);
        } else {
            await modalWindowsManagerStore.open("WindowError", "Ошибка: не удалось найти запись");
        }
    };
};

export { setupGlobalFunctions };