import React from "react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import styled from "styled-components";
import { ButtonGroup, Button, Spinner, InputGroup, Checkbox } from "@blueprintjs/core";
import { renderToStaticMarkup } from "react-dom/server"

import NoteEditMode from "../noteTabModes/NoteEditMode.jsx";
import NoteViewMode from "../noteTabModes/NoteViewMode.jsx";

import { Text, CardList } from "@blueprintjs/core";

import {
    IconTrash,
    IconLogout,
    IconCopy,
    IconEdit,
    IconEditOff,
    IconDeviceFloppy,
    IconPlayerSkipBackFilled
} from '@tabler/icons-react';

import { searchTabStore } from "../../../stores/tabsStores/SearchTabStore.js";

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

let ContainerForInputs = styled.div`
    padding-left: 0.5em;
    padding-right: 0.5em;

    & > * {
        margin-top: 0.7em;
        user-select: none;
    }

    & > * > input {
        user-select: unset;
    }

    & > * > * {
        outline: 0 !important;
    }
`;

let ListContainer = styled.div`
    margin-top: 1em;
    margin-bottom: 1em;
    width: 100%;
`;

let SearchTab = observer(() => {
    useEffect(() => {
        searchTabStore.reset();
    }, []);

    let markup = [];

    switch (searchTabStore.status) {
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
                        <ContainerForInputs>
                            <Text>Введите текст запроса: </Text>
                            <InputGroup type="text" intent="primary" placeholder="Текст запроса" onChange={searchTabStore.requestOnChangeHandler} value={searchTabStore.request} />
                            <Checkbox intent="primary" checked={searchTabStore.isPrefix} onChange={searchTabStore.isPrefixChangeHandler}>Префиксный поиск</Checkbox>
                            <Button onClick={searchTabStore.fetch} intent="primary" icon="refresh">Обновить список</Button>
                        </ContainerForInputs>
                    </ButtonGroupContainer>
                    <ListContainer>
                        <CardList dangerouslySetInnerHTML={{ __html: searchTabStore.listOfNoteCardsHtml }}>
                        </CardList>
                    </ListContainer>
                </>
            );
            break;
        default:
            markup = <></>;
    }

    return markup;
});

export default SearchTab;