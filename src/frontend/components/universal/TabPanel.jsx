import React from "react";
import styled from "styled-components";

let TabPanelMainArticle = styled.div`
  width: 100vw;
  height: calc(100vh - (2em + 2em));
  overflow-y: auto !important;
  padding: 0;
  margin-top: 0;
`;

let TabPanel = (props) => {
    if (props.isDefaultHidden) {
        return (
            <TabPanelMainArticle style={props.style} role="tabpanel" className="bp5-tab-panel has-scrollbar" id={props.id} hidden>{props.children}</TabPanelMainArticle>
        );
    } else {
        return (
            <TabPanelMainArticle style={props.style} role="tabpanel" className="bp5-tab-panel has-scrollbar" id={props.id}>{props.children}</TabPanelMainArticle>
        );
    }
};

export default TabPanel;