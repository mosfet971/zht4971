import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import styled from "styled-components";
import { noteTabStore } from "../../../stores/tabsStores/NoteTabStore.js";
import { noteTextViewerStore } from "../../../stores/noteComponentsStores/NoteTextViewerStore.js";
import { ProgressBar } from "@blueprintjs/core";

let NoteTextViewer = observer(() => {
    useEffect(() => {
        noteTextViewerStore.reset();
    }, [noteTabStore.openedNoteId]);

    switch (noteTextViewerStore.status) {
        case "loading":
            return (<>
                <br />
                <p>Загрузка...</p>
                <br />
            </>);
            break;
        case "ready":
            return (<>
                <p>{noteTextViewerStore.noteText}</p>
            </>);
            break;
        default:
            return (<></>);
            break;
    }

});

export default NoteTextViewer;