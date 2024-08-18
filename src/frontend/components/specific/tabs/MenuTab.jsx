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
    IconRecycle
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
                await tabsManagerStore.openTab("mainTabs", "readAndWrite");
                noteTabStore.createNewNoteAndOpenForWriting()
            }}>
                <IconFilePlus />
                Создать новую запись
            </MenuCard>
            <MenuCard handler={() => { modalWindowsManagerStore.open("WindowOpenNoteById"); }}>
                <IconFileSymlink />
                Открыть запись по id
            </MenuCard>
            <MenuCard handler={() => { modalWindowsManagerStore.open("WindowInfo") }}>
                <IconHelp />
                О программе
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
        </MenuCardsContainer>
    );
});

export default MenuTab;