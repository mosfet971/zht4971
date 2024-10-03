import React from "react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import styled from "styled-components";

import MenuTab from "../tabs/MenuTab.jsx";
import NoteTab from "../tabs/NoteTab.jsx";
import PrimaryTab from "../tabs/PrimaryTab.jsx";

import TabSection from "../../universal/TabSection.jsx";
import TabMenu from "../../universal/TabMenu.jsx";
import TabButton from "../../universal/TabButton.jsx";
import TabPanel from "../../universal/TabPanel.jsx";
import ListTab from "../tabs/ListTab.jsx";


let MainPage = observer(() => {
  return (<>
    <TabSection id="mainTabs">
      <TabMenu>
        <TabButton target="menu" isDefaultSelected={true}>Меню</TabButton>
        <TabButton target="list" isDefaultSelected={false}>Список</TabButton>
        <TabButton target="primary" isDefaultSelected={false}>Избранное</TabButton>
        <TabButton target="recent" isDefaultSelected={false}>Недавнее</TabButton>
        <TabButton target="search" isDefaultSelected={false}>Поиск</TabButton>
        <TabButton target="readAndWrite" isDefaultSelected={false}>Просмотр и изменение записи</TabButton>
      </TabMenu>
      <hr style={{margin: 0}}/>
      <TabPanel isDefaultHidden={false} id="menu"><MenuTab/></TabPanel>
      <TabPanel isDefaultHidden={true} id="list"><ListTab/></TabPanel>
      <TabPanel isDefaultHidden={true} id="primary"><PrimaryTab/></TabPanel>
      <TabPanel isDefaultHidden={true} id="recent">Tab B3 is active</TabPanel>
      <TabPanel isDefaultHidden={true} id="search">Tab B4 is active</TabPanel>
      <TabPanel isDefaultHidden={true} id="readAndWrite"><NoteTab/></TabPanel>
    </TabSection>
  </>);
});

export default MainPage;