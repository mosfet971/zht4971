import React from "react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import styled from "styled-components";
import { noteTabStore } from "../../../stores/tabsStores/NoteTabStore";

let NoteContainerDiv = styled.div`
    /*color: black;
    background-color: white;*/
`;

let NoteViewMode = observer(() => {
    return (<>
        <NoteContainerDiv className="bp5-light" dangerouslySetInnerHTML={{__html: noteTabStore.htmlOfCurrentNote}}></NoteContainerDiv>
        <br />
    </>);
});

export default NoteViewMode;