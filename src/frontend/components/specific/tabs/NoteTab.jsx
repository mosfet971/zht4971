import React from "react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import styled from "styled-components";
import { ButtonGroup, Button, ProgressBar } from "@blueprintjs/core";

import NoteEditMode from "../noteModes/NoteEditMode.jsx";
import NoteViewMode from "../noteModes/NoteViewMode.jsx";

import {
    IconTrash,
    IconLogout,
    IconCopy,
    IconEdit,
    IconEditOff,
    IconDeviceFloppy
} from '@tabler/icons-react';

import { noteTabStore } from "../../../stores/tabsStores/NoteTabStore.js";

let ControlsContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 0.3em;
    width: calc(100% - (0.3em + 0.3em));
    border-bottom: 0.03em solid #b8b8b8;
    padding-top: 1em;
    padding-bottom: 0.7em;
    padding-left: 0.3em;
    padding-right: 0.3em;

    & > div {
        font-size: 135%;
        min-height: 1.5em;
        max-height: 5em;
    }
`;

let ButtonContentContainer = styled.div`
    display: flex;
    justify-content: center;
    text-align: center;
    gap: 0.25em;
    align-items: center;

    & > * {
        height: 100%;
        align-self: center;
    }
`;

let ControlButton = styled.div`
    padding: 0.4em;
    background-color: #ebebeb;
    transition: background-color 150ms 50ms;
    border: #a8a8a8 0.1em solid;
    user-select: none;

    &:hover {
        background-color: #d8d8d8;
    }

    &:active {
        background-color: #a8a8a8;
    }
`;

let ButtonGroupContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
    flex-flow: column;
    padding-top: 1em;
    padding-bottom: 1em;
    border-bottom: 0.05em solid white;
`;

let NoteTab = observer(() => {
    let markup = [];

    switch (noteTabStore.status) {
        case "no":
            markup.push(<h2 style={{ margin: "1em" }}>Нет открытой записи</h2>);
            break;
        case "loading":
            markup.push(<ProgressBar intent="primary"/>);
            break;
        case "view":
            markup.push(
                <>
                    <ButtonGroupContainer>
                        <ButtonGroup large={true} alignText="center">
                            <Button intent="warning" onClick={noteTabStore.delOpenedNote}>
                                <ButtonContentContainer>
                                    <IconTrash />
                                    Удалить запись
                                </ButtonContentContainer>
                            </Button>
                            <Button intent="warning" onClick={noteTabStore.closeOpenedNote}>
                                <ButtonContentContainer>
                                    <IconLogout />
                                    Закрыть запись
                                </ButtonContentContainer>
                            </Button>
                            <Button intent="warning" onClick={noteTabStore.copyOpenedNoteId}>
                                <ButtonContentContainer>
                                    <IconCopy />
                                    Копировать идентификатор
                                </ButtonContentContainer>
                            </Button>
                            <Button intent="warning" onClick={noteTabStore.startOpenedNoteWriting}>
                                <ButtonContentContainer>
                                    <IconEdit />
                                    Изменить запись
                                </ButtonContentContainer>
                            </Button>
                        </ButtonGroup>
                    </ButtonGroupContainer>
                    <NoteViewMode />
                </>
            );
            break;
        case "edit":
            markup.push(
                <>
                    <ButtonGroupContainer>
                        <ButtonGroup large={true} alignText="center">
                            <Button intent="warning" onClick={noteTabStore.delOpenedNote}>
                                <ButtonContentContainer>
                                    <IconTrash />
                                    Удалить запись
                                </ButtonContentContainer>
                            </Button>
                            <Button intent="warning" onClick={noteTabStore.closeOpenedNote}>
                                <ButtonContentContainer>
                                    <IconLogout />
                                    Закрыть запись
                                </ButtonContentContainer>
                            </Button>
                            <Button intent="warning" onClick={noteTabStore.copyOpenedNoteId}>
                                <ButtonContentContainer>
                                    <IconCopy />
                                    Копировать идентификатор
                                </ButtonContentContainer>
                            </Button>
                            <Button intent="warning" onClick={noteTabStore.stopOpenedNoteWriting}>
                                <ButtonContentContainer>
                                    <IconEditOff />
                                    Прекратить изменение записи
                                </ButtonContentContainer>
                            </Button>
                            <Button intent="warning" onClick={noteTabStore.save}>
                                <ButtonContentContainer>
                                    <IconDeviceFloppy />
                                    Сохранить запись
                                </ButtonContentContainer>
                            </Button>
                        </ButtonGroup>
                    </ButtonGroupContainer>
                    <NoteEditMode />
                </>
            );
            break;
        default:
            markup = <></>;
    }

    return markup;
});

export default NoteTab;