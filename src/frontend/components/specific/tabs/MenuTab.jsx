import React from "react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import styled from "styled-components";
import MenuCard from "../../universal/MenuCard.jsx";
import { modalWindowsManagerStore } from "../../../stores/ModalWindowsManagerStore.js";
import { noteTabStore } from "../../../stores/tabsStores/NoteTabStore.js";
import { tabsManagerStore } from "../../../stores/TabsManagerStore.js";

import {
    IconFilePlus,
    IconHelp,
    IconLock,
    IconReportAnalytics,
    IconFileSymlink,
    IconRecycle,
    IconTag,
    IconTextRecognition
} from '@tabler/icons-react';



let MenuCardsContainer = styled.div`
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    
    & > * {
        margin: 0.5em;
    }
`;

let MenuTab = observer(() => {
    return (
        <MenuCardsContainer>
            <MenuCard handler={async () => {
                await noteTabStore.createNewNoteAndOpenForWriting();
                await tabsManagerStore.openTab("mainTabs", "readAndWrite");
            }}>
                <IconFilePlus />
                Создать новую запись
            </MenuCard>
            <MenuCard handler={() => { modalWindowsManagerStore.open("WindowOpenNoteById"); }}>
                <IconFileSymlink />
                Открыть запись по id
            </MenuCard>
            <MenuCard handler={() => { modalWindowsManagerStore.open("WindowOpenNoteByName"); }}>
                <IconFileSymlink />
                Открыть запись по названию
            </MenuCard>
            <MenuCard handler={() => { modalWindowsManagerStore.open("WindowChangePassword") }}>
                <IconLock />
                Смена пароля
            </MenuCard>
            <MenuCard handler={() => { modalWindowsManagerStore.open("WindowDBStatus") }}>
                <IconReportAnalytics />
                Статус базы данных
            </MenuCard>
            <MenuCard handler={() => { modalWindowsManagerStore.open("WindowGC") }}>
                <IconRecycle />
                Cборка мусора
            </MenuCard>
            <MenuCard handler={() => { modalWindowsManagerStore.open("WindowRecalculateTags") }}>
                <IconTextRecognition />
                Обновить данные тегов
            </MenuCard>
        </MenuCardsContainer>
    );
});

export default MenuTab;