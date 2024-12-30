import React from "react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import styled from "styled-components";
import { noteTabStore } from "../../../stores/tabsStores/NoteTabStore";

let NoteContainerDiv = styled.div`
    /*color: black;
    background-color: white;*/

    overflow-x: hidden;

    & > div > * {
        max-width: 40em;
    }
    & > div > *:has(hr) {
        max-width: unset;
    }
    & > div > *:has(table) {
        max-width: unset;
    }
    & > div > *:has(img) {
        max-width: unset;
    }
    & > div > *:has(video) {
        max-width: unset;
    }
    & > div > hr {
        max-width: unset;
    }
    & > div > table {
        max-width: unset;
    }
    & > div > img {
        max-width: unset;
    }
    & > div > video {
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