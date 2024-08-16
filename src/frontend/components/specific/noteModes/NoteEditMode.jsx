import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import styled from "styled-components";
import { noteTabStore } from "../../../stores/tabsStores/NoteTabStore.js";
import NoteTextEditor from "../noteComponents/NoteTextEditor.jsx";

let NoteEditMode = observer(() => {
    return (<>
        <p>{noteTabStore.openedNoteId + " edite"}</p>
        <NoteTextEditor/>
    </>);
});

export default NoteEditMode;