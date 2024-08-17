import React from "react";
import { observer } from "mobx-react-lite";
import ModalWindowWithFooter from "../../universal/ModalWindowWithFooter.jsx"
import { modalWindowsManagerStore } from "../../../stores/ModalWindowsManagerStore.js";
import { Button, ProgressBar } from "@blueprintjs/core";
import { useEffect } from "react";
import { windowLoadTemplateStore } from "../../../stores/modalWindowsStores/WindowLoadTemplateStore.js";


let WindowLoadTemplate = observer(() => {
    useEffect(() => {
        windowLoadTemplateStore.reset();
    }, []);


    if (windowLoadTemplateStore.status == "loading") {
        return (
            <ModalWindowWithFooter title="Использование шаблона" onClose={modalWindowsManagerStore.close}>
                <p>Идет загрузка данных, пожалуйста подождите</p>
                <ProgressBar intent="primary"/>
            </ModalWindowWithFooter>
        );
    } else if (windowLoadTemplateStore.status == "ready") {
        let templatesJsx = [];

        for (const i of windowLoadTemplateStore.templates) {
            templatesJsx.push(<>
                <p>{i.name}</p>
                <button onClick={()=>{windowLoadTemplateStore.submit(i.id)}}>Выбрать</button>
                <button onClick={()=>{windowLoadTemplateStore.deleteTemplate(i.id)}}>Удалить</button>
            </>);
        }

        return (
            <ModalWindowWithFooter title="Использование шаблона" onClose={modalWindowsManagerStore.close}>
                {templatesJsx}
            </ModalWindowWithFooter>
        );
    } else if (windowLoadTemplateStore.status == "finished") {
        return (
            <ModalWindowWithFooter title="Использование шаблона" onClose={modalWindowsManagerStore.close}>
                <p>Шаблон успешно применен</p>
            </ModalWindowWithFooter>
        );
    }
});

export default WindowLoadTemplate;