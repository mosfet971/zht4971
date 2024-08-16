import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import styled from "styled-components";
import { noteTabStore } from "../../../stores/tabsStores/NoteTabStore.js";
import { noteTextViewerStore } from "../../../stores/noteComponentsStores/noteTextViewerStore.js";
import { ProgressBar } from "@blueprintjs/core";

let NoteTextViewer = observer(() => {
    useEffect(() => {
        noteTextViewerStore.reset();
    }, []);

    switch (noteTextViewerStore.status) {
        case "loading":
            return (<>
                <ProgressBar intent="primary" />
            </>);
            break;
        case "ready":
            return (<>
                <p>{noteTextViewerStore.noteText}</p>
            </>);
            break;
        default:
            return (<>
                <p>Ошибка</p>
            </>);
            break;
    }

});

export default NoteTextViewer;