import React from "react";
import { observer } from "mobx-react-lite";
import ModalWindowWithFooter from "../../universal/ModalWindowWithFooter.jsx"
import { modalWindowsManagerStore } from "../../../stores/ModalWindowsManagerStore.js";
import { windowFilterAddStore } from "../../../stores/modalWindowsStores/WindowFilterAddStore.js";
import { ProgressBar, Button, InputGroup, ButtonGroup, Tag } from "@blueprintjs/core";
import { useEffect } from "react";

let WindowAssocEditor = observer(() => {
  useEffect(() => {
    windowFilterAddStore.reset();
  }, []);

  switch (windowFilterAddStore.status) {
    case "selectType":
      return (
        <ModalWindowWithFooter title="Добавление фильтра" onClose={modalWindowsManagerStore.close}>
          <p>Выбор типа</p>
          <Button onClick={windowFilterAddStore.saveFilterType}>Подтвердить выбор</Button>
        </ModalWindowWithFooter>
      );
      break;
    case "settings":
      return (
        <ModalWindowWithFooter title="Добавление фильтра" onClose={modalWindowsManagerStore.close}>
          <p>Настройки</p>
          <Button onClick={windowFilterAddStore.save}>Сохранить</Button>
        </ModalWindowWithFooter>
      );
      break;
    default:
      return (<></>);
      break;
  }
});

export default WindowAssocEditor;