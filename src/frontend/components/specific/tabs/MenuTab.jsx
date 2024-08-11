import React from "react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import styled from "styled-components";
import MenuCard from "../../universal/MenuCard.jsx";
import { modalWindowsManagerStore } from "../../../stores/ModalWindowsManagerStore.js";

import { 
    IconFilePlus, 
    IconHelp,
    IconLock,
    IconReportAnalytics,
    IconSettingsSearch,
    IconSettingsCode,
    IconArrowMerge,
    IconZoomScan,
    IconFileSymlink,
    IconRecycle
} from '@tabler/icons-react';
import { noteTabStore } from "../../../stores/NoteTabStore.js";

let MenuCardsContainer = styled.div`
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    
    & > * {
        margin: 1em;
    }
`;

let MenuTab = observer(() => {
    return (
        <MenuCardsContainer>
            <MenuCard handler={noteTabStore.createNewNoteAndOpenForWriting}>
                <IconFilePlus/>
                Создать новую запись
            </MenuCard>
            <MenuCard handler={()=>{modalWindowsManagerStore.open("WindowOpenNoteById");}}>
                <IconFileSymlink/>
                Открыть запись по id
            </MenuCard>
            <MenuCard handler={alert}>
                <IconHelp/>
                Справочник
            </MenuCard>
            <MenuCard handler={alert}>
                <IconLock/>
                Смена пароля
            </MenuCard>
            <MenuCard handler={alert}>
                <IconReportAnalytics/>
                Статус базы данных
            </MenuCard>
            <MenuCard handler={()=>{modalWindowsManagerStore.open("WindowGC")}}>
                <IconRecycle/>
                Cборка мусора
            </MenuCard>
        </MenuCardsContainer>
    );
});

export default MenuTab;