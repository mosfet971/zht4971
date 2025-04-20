import React from "react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import styled from "styled-components";
import { ButtonGroup, Button, Spinner, InputGroup, Checkbox } from "@blueprintjs/core";
import { renderToStaticMarkup } from "react-dom/server"

import { Text, CardList, TagInput } from "@blueprintjs/core";

import {
    IconTrash,
    IconLogout,
    IconCopy,
    IconEdit,
    IconEditOff,
    IconDeviceFloppy,
    IconPlayerSkipBackFilled
} from '@tabler/icons-react';

import { tagSearchTabStore } from "../../../stores/tabsStores/TagSearchTabStore.js";

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

let TagSearchTab = observer(() => {
    useEffect(() => {
        tagSearchTabStore.reset();
    }, []);

    let markup = [];

    switch (tagSearchTabStore.status) {
        case "loading":
            markup.push(
                <>
                    <ButtonGroupContainer>
                        <ContainerForInputs>
                            <Text>Введите свободные теги запроса: (нажимайте клавишу "ввод" для сохранения каждого тега)</Text>
                            <TagInput inputProps={{className: "tagSearchInput"}} placeholder="Теги записи" intent="primary" fill={true} values={tagSearchTabStore.tagsStrings} onChange={tagSearchTabStore.noteTagsStringsChangeEventHandler} />
                            <Button onClick={tagSearchTabStore.fetch} intent="primary" icon="refresh">Обновить список</Button><div style={{marginLeft: "0.5em", display: "inline-block", position: "absolute"}}>Загрузка...</div>
                        </ContainerForInputs>
                    </ButtonGroupContainer>
                    <ListContainer>
                        <CardList dangerouslySetInnerHTML={{ __html: tagSearchTabStore.listOfNoteCardsHtml }}>
                        </CardList>
                    </ListContainer>
                </>
            );
            break;
        case "ready":
            markup.push(
                <>
                    <ButtonGroupContainer>
                        <ContainerForInputs>
                            <Text>Введите свободные теги запроса: (нажимайте клавишу "ввод" для сохранения каждого тега)</Text>
                            <TagInput inputProps={{className: "tagSearchInput"}} placeholder="Теги записи" intent="primary" fill={true} values={tagSearchTabStore.tagsStrings} onChange={tagSearchTabStore.noteTagsStringsChangeEventHandler} />
                            <Button onClick={tagSearchTabStore.fetch} intent="primary" icon="refresh">Обновить список</Button>
                        </ContainerForInputs>
                    </ButtonGroupContainer>
                    <ListContainer>
                        <CardList dangerouslySetInnerHTML={{ __html: tagSearchTabStore.listOfNoteCardsHtml }}>
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

export default TagSearchTab;