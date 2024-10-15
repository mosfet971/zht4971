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
      let filterTabsOptions = [];
      for (const i in windowFilterAddStore.filterTypeToDisplayTextMap) {
        filterTabsOptions.push(<>
          <option value={i}>{windowFilterAddStore.filterTypeToDisplayTextMap[i]}</option>
        </>);
      }
      return (
        <ModalWindowWithFooter title="Добавление фильтра" onClose={modalWindowsManagerStore.close}>
          <p>Выберите тип фильра:</p>
          <br></br>
          <select style={{ width: "100%" }} value={windowFilterAddStore.filterType} name="select" onChange={(e) => windowFilterAddStore.setFilterType(e.target.value)}>
            {filterTabsOptions}
          </select>

          <Button intent="primary" onClick={windowFilterAddStore.saveFilterType}>Подтвердить выбор</Button>
        </ModalWindowWithFooter>
      );
      break;
    case "settings":
      return (
        <ModalWindowWithFooter title="Добавление фильтра" onClose={modalWindowsManagerStore.close}>
          <p>Настройки: </p>
          
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