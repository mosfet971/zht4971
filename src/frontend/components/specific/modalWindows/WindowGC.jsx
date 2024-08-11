import React from "react";
import { observer } from "mobx-react-lite";
import ModalWindowWithFooter from "../../universal/ModalWindowWithFooter.jsx"
import { modalWindowsManagerStore } from "../../../stores/ModalWindowsManagerStore.js";
import { Button, ProgressBar } from "@blueprintjs/core";
import { windowGCStore } from "../../../stores/modalWindowsStores/WindowGCStore.js";
import { useEffect } from "react";

let WindowGC = observer(() => {
    useEffect(() => {
        windowGCStore.reset();
    }, []);

    if (windowGCStore.status == "ready") {
        return (
            <ModalWindowWithFooter title="Сборка мусора" onClose={modalWindowsManagerStore.close}>
                <Button icon="trash" onClick={windowGCStore.start}>Запустить сборку мусора</Button>
            </ModalWindowWithFooter>
        );
    } else if (windowGCStore.status == "loading") {
        return (
            <ModalWindowWithFooter title="Сборка мусора" onClose={modalWindowsManagerStore.close}>
                <p>Идет удаление мусорных файлов, пожалуйста подождите</p>
                <ProgressBar intent="primary"/>
            </ModalWindowWithFooter>
        );
    } else if (windowGCStore.status == "finished") {
        return (
            <ModalWindowWithFooter title="Сборка мусора" onClose={modalWindowsManagerStore.close}>
                <p>Сборка мусора завершена</p>
            </ModalWindowWithFooter>
        );
    }
});

export default WindowGC;