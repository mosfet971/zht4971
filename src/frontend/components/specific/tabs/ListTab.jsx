import React from "react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import styled from "styled-components";
import { ButtonGroup, Button, Spinner } from "@blueprintjs/core";
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

import { listTabStore } from "../../../stores/tabsStores/ListTabStore.js";

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

let FiltersSettingsContainer = styled.div`
    border: 0.1em white solid;
    padding: 1em;
    width: 100%;
    min-height: 10em;

    & > button {
        margin-bottom: 1em;
    }
`;

let ListTab = observer(() => {
    useEffect(() => {
        listTabStore.reset();
    }, []);

    let markup = [];

    switch (listTabStore.status) {
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
                            <Text>Сортировка: </Text>
                            <select style={{ width: "100%" }} value={listTabStore.sortMode} name="select" onChange={listTabStore.sortModeChangeHandler}>
                                <option value="byCreationTime" >По времени создания</option>
                                <option value="byGetTime">По времени просмотра</option>
                                <option value="byEditionTime">По времени изменения</option>
                            </select>
                            <Text>Порядок сортировки: </Text>
                            <select style={{ width: "100%" }} value={listTabStore.sortOrder} name="select" onChange={listTabStore.sortOrderChangeHandler}>
                                <option value="aToB">По возрастанию</option>
                                <option value="bToA">По убыванию</option>
                            </select>
                            <FiltersSettingsContainer>
                                <Button onClick={listTabStore.openFiltersWindow} intent="primary">Добавить фильтр</Button>
                                <CardList>{JSON.stringify(listTabStore.filtersList)}</CardList>
                            </FiltersSettingsContainer>
                            <Button onClick={listTabStore.fetch} intent="primary" icon="refresh">Обновить</Button>
                        </ContainerForInputs>
                    </ButtonGroupContainer>
                    <ListContainer>
                        <CardList dangerouslySetInnerHTML={{ __html: listTabStore.listOfNoteCardsHtml }}>
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

export default ListTab;