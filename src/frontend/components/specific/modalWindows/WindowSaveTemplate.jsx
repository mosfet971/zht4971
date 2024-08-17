import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import ModalWindowWithFooter from "../../universal/ModalWindow.jsx"
import styled from "styled-components";
import { modalWindowsManagerStore } from "../../../stores/ModalWindowsManagerStore.js";
import { InputGroup, Button, ProgressBar } from "@blueprintjs/core";
import { windowSaveTemplateStore } from "../../../stores/modalWindowsStores/WindowSaveTemplateStore.js";

let WindowSaveTemplate = observer(() => {
    useEffect(() => {
        windowSaveTemplateStore.reset();
    }, []);

    if (windowSaveTemplateStore.status == "ready") {
        return (
            <ModalWindowWithFooter title="Сохранение шаблона" onClose={modalWindowsManagerStore.close}>
                <InputGroup
                    onInput={windowSaveTemplateStore.templateNameInputHandler}
                    placeholder="название шаблона"
                />
                <br/>
                <Button onClick={windowSaveTemplateStore.submit}>Сохранить шаблон</Button>
            </ModalWindowWithFooter>
        );
    }
    else if (windowSaveTemplateStore.status == "loading") {
        return (
            <ModalWindowWithFooter title="Сохранение шаблона" onClose={modalWindowsManagerStore.close}>
                <p>Идет сохранение шаблона, пожалуйста подождите</p>
                <ProgressBar intent="primary" />
            </ModalWindowWithFooter>
        );
    } else if (windowSaveTemplateStore.status == "finished") {
        return (
            <ModalWindowWithFooter title="Сохранение шаблона" onClose={modalWindowsManagerStore.close}>
                <p>Шаблон успешно сохранен</p>
            </ModalWindowWithFooter>
        );
    } else if (windowSaveTemplateStore.status == "error") {
        return (
            <ModalWindowWithFooter title="Сохранение шаблона" onClose={modalWindowsManagerStore.close}>
                <p>Ошибка: название шаблона уже занято</p>
                <Button onClick={windowSaveTemplateStore.reset}>Попробовать еще раз</Button>
            </ModalWindowWithFooter>
        );
    }
});

export default WindowSaveTemplate;