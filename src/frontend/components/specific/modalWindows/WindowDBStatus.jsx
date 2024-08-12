import React from "react";
import { observer } from "mobx-react-lite";
import ModalWindowWithFooter from "../../universal/ModalWindowWithFooter.jsx"
import { modalWindowsManagerStore } from "../../../stores/ModalWindowsManagerStore.js";
import { Button, ProgressBar } from "@blueprintjs/core";
import { useEffect } from "react";
import { windowDBStatusStore } from "../../../stores/modalWindowsStores/WindowDBStatusStore.js";

let WindowDBStatus = observer(() => {
    useEffect(() => {
        windowDBStatusStore.reset();
    }, []);


    if (windowDBStatusStore.status == "loading") {
        return (
            <ModalWindowWithFooter title="Статаус базы данных" onClose={modalWindowsManagerStore.close}>
                <p>Идет обработка данных, пожалуйста подождите</p>
                <ProgressBar intent="primary"/>
            </ModalWindowWithFooter>
        );
    } else if (windowDBStatusStore.status == "finished") {
        return (
            <ModalWindowWithFooter title="Статаус базы данных" onClose={modalWindowsManagerStore.close}>
                <p>Количество записей: { windowDBStatusStore.dbStatus.notesNumber }</p>
                <p>Количество шаблонов: { windowDBStatusStore.dbStatus.templatesNumber }</p>
                <p>Количество файлов: { windowDBStatusStore.dbStatus.filesNumber }</p>
            </ModalWindowWithFooter>
        );
    }
});

export default WindowDBStatus;