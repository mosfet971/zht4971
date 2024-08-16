import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import styled from "styled-components";
import { noteTabStore } from "../../../stores/tabsStores/NoteTabStore.js";
import { noteTextEditorStore } from "../../../stores/noteComponentsStores/noteTextEditorStore.js";
import { ProgressBar } from "@blueprintjs/core";

let NoteTextEditor = observer(() => {
    useEffect(() => {
        noteTextEditorStore.reset();
    }, []);



    switch (noteTextEditorStore.status) {
        case "loading":
            return (<>
                <ProgressBar intent="primary" />
            </>);
            break;
        case "ready":
            return (<>
                <textarea
                    value={noteTextEditorStore.noteText}
                    onInput={noteTextEditorStore.noteTextInputHandler}
                >
                </textarea>
            </>);
            break;
        default:
            return (<>
                <p>Ошибка</p>
            </>);
            break;
    }
});

export default NoteTextEditor;