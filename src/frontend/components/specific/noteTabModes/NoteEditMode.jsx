import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import styled from "styled-components";
import { noteTabStore } from "../../../stores/tabsStores/NoteTabStore.js";
import { Button, ButtonGroup, TextArea } from "@blueprintjs/core";
import { modalWindowsManagerStore } from "../../../stores/ModalWindowsManagerStore.js";

let SourceTextEditorContainer = styled.div`
    width: 100%;

    & > textarea {
        min-width: 100% !important;
        width: 100% !important;
        min-height: 30em;
    }
`;

let NoteEditMode = observer(() => {
    return (<>
        <SourceTextEditorContainer>
            <ButtonGroup large={true} alignText="center">
                <Button icon="document-share" onClick={() => { modalWindowsManagerStore.open("WindowSaveTemplate") }}>Сохранить как шаблон</Button>
                <Button icon="document" onClick={() => { modalWindowsManagerStore.open("WindowTemplates") }}>Шаблоны</Button>
            </ButtonGroup>
            <TextArea
                autoResize={true}
                large={true}
                value={noteTabStore.noteObject.sourceText}
                onInput={noteTabStore.noteTextInputEventHandler}
            >
            </TextArea>
        </SourceTextEditorContainer>
        <br /><br /><br />
    </>);
});

export default NoteEditMode;