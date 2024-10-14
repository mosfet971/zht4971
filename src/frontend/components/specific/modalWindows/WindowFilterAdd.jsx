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
          <p>Выберите тип фильра:</p>

          <Button intent="primary" onClick={windowFilterAddStore.saveFilterType}>Подтвердить выбор</Button>
        </ModalWindowWithFooter>
      );
      break;
    case "settings":
      return (
        <ModalWindowWithFooter title="Добавление фильтра" onClose={modalWindowsManagerStore.close}>
          <p>Настройки</p>
          <Button intent="primary" onClick={windowFilterAddStore.save}>Сохранить</Button>
        </ModalWindowWithFooter>
      );
      break;
    case "error":
      return (
        <ModalWindowWithFooter title="Добавление фильтра" onClose={modalWindowsManagerStore.close}>
          <p>Ошибка</p>
          <Button intent="primary" onClick={windowFilterAddStore.reset}>Попробовать еще раз</Button>
        </ModalWindowWithFooter>
      );
      break;
    default:
      return (<></>);
      break;
  }
});

export default WindowAssocEditor;