import React from "react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import styled from "styled-components";
import { noteTabStore } from "../../../stores/tabsStores/NoteTabStore";
import NoteTextViewer from "../noteComponents/NoteTextViewer.jsx";

let NoteViewMode = observer(() => {
    return (<>
        <p>{noteTabStore.openedNoteId + " read"}</p>
        <NoteTextViewer />
    </>);
});

export default NoteViewMode;