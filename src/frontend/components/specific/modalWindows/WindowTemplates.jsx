import React from "react";
import { observer } from "mobx-react-lite";
import ModalWindowWithFooter from "../../universal/ModalWindowWithFooter.jsx"
import { modalWindowsManagerStore } from "../../../stores/ModalWindowsManagerStore.js";
import { Button, ProgressBar } from "@blueprintjs/core";
import { useEffect } from "react";
import { windowTemplatesStore } from "../../../stores/modalWindowsStores/WindowTemplatesStore.js";


let WindowTemplates = observer(() => {
    useEffect(() => {
        windowTemplatesStore.reset();
    }, []);


    if (windowTemplatesStore.status == "loading") {
        return (
            <ModalWindowWithFooter title="Использование шаблона" onClose={modalWindowsManagerStore.close}>
                <p>Идет загрузка данных, пожалуйста подождите</p>
                <ProgressBar intent="primary"/>
            </ModalWindowWithFooter>
        );
    } else if (windowTemplatesStore.status == "ready") {
        let templatesJsx = [];

        for (const i of windowTemplatesStore.templates) {
            templatesJsx.push(<>
                <p>{i.name}</p>
                <button onClick={()=>{windowTemplatesStore.submit(i.id)}}>Выбрать</button>
                <button onClick={()=>{windowTemplatesStore.deleteTemplate(i.id)}}>Удалить</button>
            </>);
        }

        return (
            <ModalWindowWithFooter title="Использование шаблона" onClose={modalWindowsManagerStore.close}>
                {templatesJsx}
            </ModalWindowWithFooter>
        );
    } else if (windowTemplatesStore.status == "finished") {
        return (
            <ModalWindowWithFooter title="Использование шаблона" onClose={modalWindowsManagerStore.close}>
                <p>Шаблон успешно применен</p>
            </ModalWindowWithFooter>
        );
    }
});

export default WindowTemplates;