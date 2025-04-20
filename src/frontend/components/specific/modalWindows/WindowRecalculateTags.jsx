import React from "react";
import { observer } from "mobx-react-lite";
import ModalWindowWithFooter from "../../universal/ModalWindowWithFooter.jsx"
import { modalWindowsManagerStore } from "../../../stores/ModalWindowsManagerStore.js";
import { Button, ProgressBar, Text } from "@blueprintjs/core";
import { windowRecalculateTagsStore } from "../../../stores/modalWindowsStores/WindowRecalculateTagsStore.js";
import { useEffect } from "react";
import {
    IconTextRecognition
} from '@tabler/icons-react';

let WindowRecalculateTags = observer(() => {
    useEffect(() => {
        windowRecalculateTagsStore.reset();
    }, []);

    if (windowRecalculateTagsStore.status == "ready") {
        return (
            <ModalWindowWithFooter title="Обновление данных тегов" onClose={modalWindowsManagerStore.close}>
                <Text>После изменения файла "model.json" необходимо обновить данные тегов для обеспечения нормального функционирования поиска.</Text>
                <br/>
                <Button onClick={windowRecalculateTagsStore.start}>Запустить обновление данных</Button>
            </ModalWindowWithFooter>
        );
    } else if (windowRecalculateTagsStore.status == "loading") {
        return (
            <ModalWindowWithFooter title="Обновление данных тегов" onClose={modalWindowsManagerStore.close}>
                <p>Идет обновление данных тегов, пожалуйста подождите</p>
                <ProgressBar intent="primary"/>
            </ModalWindowWithFooter>
        );
    } else if (windowRecalculateTagsStore.status == "finished") {
        return (
            <ModalWindowWithFooter title="Обновление данных тегов" onClose={modalWindowsManagerStore.close}>
                <p>Обновление данных завершенно</p>
            </ModalWindowWithFooter>
        );
    }
});

export default WindowRecalculateTags;