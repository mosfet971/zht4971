import React from "react";
import { observer } from "mobx-react-lite";
import ModalWindowWithFooter from "../../universal/ModalWindowWithFooter.jsx"
import { modalWindowsManagerStore } from "../../../stores/ModalWindowsManagerStore.js";
import { Button, ButtonGroup, Card, CardList, ProgressBar } from "@blueprintjs/core";
import { useEffect } from "react";
import { windowTemplatesStore } from "../../../stores/modalWindowsStores/WindowTemplatesStore.js";


let WindowTemplates = observer(() => {
    useEffect(() => {
        windowTemplatesStore.reset();
    }, []);


    if (windowTemplatesStore.status == "loading") {
        return (
            <ModalWindowWithFooter title="Шаблоны" onClose={modalWindowsManagerStore.close}>
                <p>Идет загрузка данных, пожалуйста подождите</p>
                <ProgressBar intent="primary" />
            </ModalWindowWithFooter>
        );
    } else if (windowTemplatesStore.status == "ready") {
        let templatesJsx = [];

        for (const i of windowTemplatesStore.templates) {
            templatesJsx.push(<Card style={{display: "block"}}>
                <p style={{ wordBreak: "break-all" }}>{i.name}</p>
                <ButtonGroup>
                    <Button intent="primary" icon="tick" onClick={() => { windowTemplatesStore.submit(i.id) }}>Выбрать</Button>
                    <Button intent="danger" icon="trash" onClick={() => { windowTemplatesStore.deleteTemplate(i.id) }}>Удалить</Button>
                </ButtonGroup>
            </Card>);
        }

        return (
            <ModalWindowWithFooter title="Шаблоны" onClose={modalWindowsManagerStore.close}>
                <CardList>
                    {templatesJsx}
                </CardList>
            </ModalWindowWithFooter>
        );
    } else if (windowTemplatesStore.status == "finished") {
        return (
            <ModalWindowWithFooter title="Шаблоны" onClose={modalWindowsManagerStore.close}>
                <p>Шаблон успешно применен</p>
            </ModalWindowWithFooter>
        );
    }
});

export default WindowTemplates;