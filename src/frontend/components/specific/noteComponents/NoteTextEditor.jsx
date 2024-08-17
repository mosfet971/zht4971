import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import styled from "styled-components";
import { noteTabStore } from "../../../stores/tabsStores/NoteTabStore.js";
import { noteTextEditorStore } from "../../../stores/noteComponentsStores/NoteTextEditorStore.js";
import { Button, ButtonGroup, ProgressBar, TextArea } from "@blueprintjs/core";
import { modalWindowsManagerStore } from "../../../stores/ModalWindowsManagerStore.js";

let EditorContainer = styled.div`
    width: 100%;

    & > textarea {
        min-width: 100% !important;
        width: 100% !important;
        min-height: 30em;
    }
`;

let ButtonContentContainer = styled.div`
    display: flex;
    justify-content: center;
    text-align: center;
    gap: 0.25em;
    align-items: center;

    & > * {
        height: 100%;
        align-self: center;
    }
`;


let NoteTextEditor = observer(() => {
    useEffect(() => {
        noteTextEditorStore.reset();
    }, [noteTabStore.openedNoteId]);

    switch (noteTextEditorStore.status) {
        case "loading":
            return (<>
                <br/>
                <p>Загрузка...</p>
                <br/>
            </>);
            break;
        case "ready":
            return (<EditorContainer>
                <ButtonGroup large={true} alignText="center">
                    <Button icon="document-share" onClick={()=>{modalWindowsManagerStore.open("WindowSaveTemplate")}}>Сохранить как шаблон</Button>
                    <Button icon="document" onClick={()=>{modalWindowsManagerStore.open("WindowLoadTemplate")}}>Использовать шаблон</Button>
                </ButtonGroup>
                <TextArea 
                    autoResize={true}
                    large={true}
                    value={noteTextEditorStore.noteText}
                    onInput={noteTextEditorStore.noteTextInputHandler}
                >
                </TextArea>
            </EditorContainer>);
            break;
        default:
            return (<></>);
            break;
    }
});

export default NoteTextEditor;