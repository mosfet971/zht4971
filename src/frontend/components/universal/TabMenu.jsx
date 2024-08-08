import React from "react";
import styled from "styled-components";

let TabMenuMenu = styled.ul`
  height: 2em;
  margin: 1em;
`;

let TabMenu = (props) => {
    return (
        <TabMenuMenu className="bp5-tab-list" role="tablist" aria-label="tabsMenu">{props.children}</TabMenuMenu>
    );
};

export default TabMenu;