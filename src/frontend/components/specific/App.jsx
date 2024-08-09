import React from "react";
import { observer } from "mobx-react-lite";
import MainPage from "./pages/MainPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ModalWindowWrapper from "./wrappers/ModalWindowWrapper.jsx";

import styled from "styled-components";

import { modalWindowsManagerStore } from "../../stores/ModalWindowsManagerStore.js";
import { loginStore } from "../../stores/LoginStore.js"

import { Colors, OverlaysProvider } from "@blueprintjs/core";

let Background = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
`;

let WindowDragArea = styled.div`
  width: 100vw;
  position: fixed;
  height: 1.5em;
  top: 0;
  -webkit-app-region: drag;
  z-index: 1;
`;

let App = observer(() => {
  let content = [];

  content.push(<WindowDragArea></WindowDragArea>);

  if (loginStore.isLogined) {
    content.push(<MainPage />);
  } else {
    content.push(<LoginPage />);
  }

  if (modalWindowsManagerStore.isOpened) {
    content.push(<ModalWindowWrapper />);
  }

  return (
    <Background style={{ color: Colors.WHITE, background: Colors.DARK_GRAY2 }} className="bp5-dark">
      <OverlaysProvider>
        {content}
      </OverlaysProvider>
    </Background>
  );
});

export default App;