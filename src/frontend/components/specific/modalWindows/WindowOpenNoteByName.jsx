import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import ModalWindow from "../../universal/ModalWindow.jsx"
import styled from "styled-components";
import { modalWindowsManagerStore } from "../../../stores/ModalWindowsManagerStore.js";
import { InputGroup, Button, ProgressBar } from "@blueprintjs/core";
import { windowOpenNoteByNameStore } from "../../../stores/modalWindowsStores/WindowOpenNoteByNameStore.js";


let WindowOpenNoteByName = observer(() => {
    useEffect(() => {
        windowOpenNoteByNameStore.reset();
    }, []);

    if (windowOpenNoteByNameStore.status == "ready") {
        return (
            <ModalWindow title="Открытие записи" onClose={modalWindowsManagerStore.close}>
                <p style={{ width: "20em", fontSize: "large" }}>Введите название или псевдоним записи:</p>
                <div>
                    <InputGroup
                        type="text"
                        onInput={windowOpenNoteByNameStore.nameInputOninputHandler}
                        placeholder="название или псевдоним"
                        onKeyDown={(e) => { e.key == "Enter" ? windowOpenNoteByNameStore.submit() : false }}
                    />
                    <br />
                    <Button onClick={windowOpenNoteByNameStore.submit}>Открыть</Button>
                </div>
            </ModalWindow>
        );
    } else {
        return (
            <ModalWindow title="Открытие записи" onClose={modalWindowsManagerStore.close}>
                <p>Идет поиск записи, пожалуйста подождите</p>
                <ProgressBar intent="primary" />
            </ModalWindow>
        );
    }
});

export default WindowOpenNoteByName;