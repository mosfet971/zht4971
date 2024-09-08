import React from "react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import styled from "styled-components";
import { noteTabStore } from "../../../stores/tabsStores/NoteTabStore";

let NoteViewMode = observer(() => {
    return (<>
        <div dangerouslySetInnerHTML={{__html: noteTabStore.htmlOfCurrentNote}}></div>
        <br />
    </>);
});

export default NoteViewMode;