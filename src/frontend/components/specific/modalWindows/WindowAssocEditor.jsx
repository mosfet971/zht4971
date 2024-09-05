import React from "react";
import { observer } from "mobx-react-lite";
import ModalWindowWithFooter from "../../universal/ModalWindowWithFooter.jsx"
import { modalWindowsManagerStore } from "../../../stores/ModalWindowsManagerStore.js";
import { windowAssocEditorStore } from "../../../stores/modalWindowsStores/WindowAssocEditorStore.js";
import { ProgressBar, Text, Button, InputGroup, ButtonGroup } from "@blueprintjs/core";
import { useEffect } from "react";

let WindowAssocEditor = observer(() => {
  useEffect(() => {
    windowAssocEditorStore.reset();
  }, []);

  switch (windowAssocEditorStore.status) {
    case "loading":
      return (
        <ModalWindowWithFooter title="Редактор ассоциаций" onClose={modalWindowsManagerStore.close}>
          <p>Идет обработка данных, пожалуйста подождите</p>
          <ProgressBar intent="primary" />
        </ModalWindowWithFooter>
      );
      break;
    case "ready":
      return (
        <ModalWindowWithFooter title="Редактор ассоциаций" onClose={modalWindowsManagerStore.close}>
          <p style={{fontSize: "medium"}}>{windowAssocEditorStore.assocsNamesAndIdsList}</p>
          <Button onClick={windowAssocEditorStore.save} intent="primary">Сохранить</Button>
        </ModalWindowWithFooter>
      );
      break;
    case "finished":
      return (
        <ModalWindowWithFooter title="Редактор ассоциаций" onClose={modalWindowsManagerStore.close}>
          <p style={{fontSize: "medium"}}>Готово</p>
        </ModalWindowWithFooter>
      );
      break;
    default:
      return (<></>);
      break;
  }
});

export default WindowAssocEditor;