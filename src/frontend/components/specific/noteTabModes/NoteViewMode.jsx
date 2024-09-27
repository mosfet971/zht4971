import React from "react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import styled from "styled-components";
import { noteTabStore } from "../../../stores/tabsStores/NoteTabStore";

let NoteContainerDiv = styled.div`
    /*color: black;
    background-color: white;*/

    overflow-x: hidden;

    & > div > p {
        max-width: 40em;
    }
    & > div > p:has(table) {
        max-width: unset;
    }
    & > div > p:has(img) {
        max-width: unset;
    }
    & > div > p:has(video) {
        max-width: unset;
    }
`;

let NoteViewMode = observer(() => {
    return (<>
        <NoteContainerDiv className="bp5-light" dangerouslySetInnerHTML={{__html: noteTabStore.htmlOfCurrentNote}}></NoteContainerDiv>
        <br />
    </>);
});

export default NoteViewMode;