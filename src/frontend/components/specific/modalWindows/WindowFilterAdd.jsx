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

          <select style={{ width: "100%", marginButtom: "1em" }} value={windowFilterAddStore.filterType} name="select" onChange={(e) => windowFilterAddStore.setFilterType(e.target.value)}>
            {filterTabsOptions}
          </select>

          <Button intent="primary" onClick={windowFilterAddStore.saveFilterType}>Подтвердить выбор</Button>
        </ModalWindowWithFooter>
      );
      break;
    case "settings":
      /**
       *     filterParamToDisplayTextMap = {
        "type": "Тип фильтра",
        "paramName": "Параметр записи",
        "minValue": "Минимальное числовое значение",
        "maxValue": "Максимальное числовое значение",
        "isInverted": "Инверсия",
        "value": "Текстовое значение"
    };
       */
      let filterParamsInputs = [];

      for (const i of windowFilterAddStore.actualFilterParamsList) {
        switch (i) {
          case "paramName": {
            let noteParamsOptions = [];
            for (const j of windowFilterAddStore.actualNoteParamsList) {
              noteParamsOptions.push(<option value={j}>{windowFilterAddStore.noteParamToDisplayTextMap[j]}</option>);
            }
            filterParamsInputs.push(<>
              <select style={{ width: "100%", marginButtom: "1em" }} name="select" onChange={(e) => windowFilterAddStore.setFilterObjectParam("paramName", e.target.value)}>
                {noteParamsOptions}
              </select>
            </>);
            break;
          }

          // TODO: доделать для других типов

          default: {
            break;
          }
        }
      }
      return (
        <ModalWindowWithFooter title="Добавление фильтра" onClose={modalWindowsManagerStore.close}>
          <p>Выберите параметр записи для фильра:</p>
          {filterParamsInputs}

          <Button intent="primary" onClick={windowFilterAddStore.save}>Сохранить</Button>
        </ModalWindowWithFooter>
      );
      break;
    case "error":
      return (
        <ModalWindowWithFooter title="Добавление фильтра" onClose={modalWindowsManagerStore.close}>
          <p>Ошибка: что-то пошло не так</p>
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