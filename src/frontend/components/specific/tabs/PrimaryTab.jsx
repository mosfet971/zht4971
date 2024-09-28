import React from "react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import styled from "styled-components";
import { ButtonGroup, Button, Spinner } from "@blueprintjs/core";

import NoteEditMode from "../noteTabModes/NoteEditMode.jsx";
import NoteViewMode from "../noteTabModes/NoteViewMode.jsx";

import { Text } from "@blueprintjs/core";

import {
    IconTrash,
    IconLogout,
    IconCopy,
    IconEdit,
    IconEditOff,
    IconDeviceFloppy,
    IconPlayerSkipBackFilled
} from '@tabler/icons-react';

import { primaryTabStore } from "../../../stores/tabsStores/PrimaryTabStore.js";



let ButtonGroupContainerWithoutBorder = styled.div`
    width: 100%;
    padding-top: 1em;
    padding-bottom: 1em;
`;

let ButtonGroupContainer = styled.div`
    width: 100%;
    padding-top: 1em;
    padding-bottom: 1em;
    border-bottom: 0.05em solid white;
`;


let PrimaryTab = observer(() => {
    useEffect(() => {
        primaryTabStore.reset();
    }, []);

    let markup = [];

    switch (primaryTabStore.status) {
        case "loading":
            markup.push(
                <>
                    <ButtonGroupContainerWithoutBorder>
                        <Spinner intent="primary" />
                    </ButtonGroupContainerWithoutBorder>
                </>
            );
            break;
        case "ready":
            markup.push(
                <>
                    <ButtonGroupContainer>
                        <Text>Сортировка: </Text>
                        <select style={{ width: "100%" }} name="select" onChange={primaryTabStore.sortModeChangeHandler}>
                            <option value="byCreationTime" selected={primaryTabStore.sortMode == "byCreationTime"}>По времени создания</option>
                            <option value="byGetTime" selected={primaryTabStore.sortMode == "byGetTime"}>По времени последнего просмотра</option>
                            <option value="byEditionTime" selected={primaryTabStore.sortMode == "byEditionTime"}>По времени последнего изменения</option>
                        </select>
                        <Text>Порядок сортировки: </Text>
                        <select style={{ width: "100%" }} name="select" onChange={primaryTabStore.sortOrderChangeHandler}>
                            <option value="aToB" selected={primaryTabStore.sortOrder == "aToB"}>По возрастанию</option>
                            <option value="bToA" selected={primaryTabStore.sortOrder == "bToA"}>По убыванию</option>
                        </select>
                    </ButtonGroupContainer>
                    <div dangerouslySetInnerHTML={{ __html: primaryTabStore.listOfNoteCardsHtml }} />
                </>
            );
            break;
        default:
            markup = <></>;
    }

    return markup;
});

export default PrimaryTab;