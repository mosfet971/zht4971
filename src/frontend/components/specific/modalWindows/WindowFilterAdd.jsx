import React from "react";
import { observer } from "mobx-react-lite";
import ModalWindowWithFooter from "../../universal/ModalWindowWithFooter.jsx"
import { modalWindowsManagerStore } from "../../../stores/ModalWindowsManagerStore.js";
import { windowFilterAddStore } from "../../../stores/modalWindowsStores/WindowFilterAddStore.js";
import { ProgressBar, Button, InputGroup, ButtonGroup, Tag } from "@blueprintjs/core";
import { useEffect } from "react";

import styled from "styled-components";

let InputsContainerDiv = styled.div`
  &>input {
    margin-bottom: 1em;
    width: 100%;
  }
  &>select {
    width: 100%;
    margin-bottom: 1em;
  }
`;


let WindowAssocEditor = observer(() => {
  useEffect(() => {
    windowFilterAddStore.reset();
  }, []);

  switch (windowFilterAddStore.status) {
    case "settings":
      /**
       *    {
        "type": "Тип фильтра",
        "paramName": "Параметр записи",
        "minValue": "Минимальное числовое значение",
        "maxValue": "Максимальное числовое значение",
        "isInverted": "Инверсия",
        "value": "Текстовое значение",
        "minDateValue": "Минимальная дата",
        "minDateValue": "Максимальная дата",
    };
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
              <p>Свойство для фильтрации:</p>
              <select name="select" onChange={(e) => windowFilterAddStore.setFilterObjectParam(i, e.target.value)}>
                {noteParamsOptions}
              </select>
            </>);
            break;
          }

          case "minValue": {
            filterParamsInputs.push(<>
              <p>Минимальное включительное числовое значение:</p>
              <input className="bp5-input bp5-intent-primary" defaultValue={windowFilterAddStore.filterParamsToDefaultVals[i]} placeholder="Минимальное включительное числовое значение" type="number" onChange={(e) => windowFilterAddStore.setFilterObjectParam(i, parseInt(e.target.value))} />
            </>);
            break;
          }

          case "maxValue": {
            filterParamsInputs.push(<>
              <p>Максимальное включительное числовое значение:</p>
              <input className="bp5-input bp5-intent-primary" defaultValue={windowFilterAddStore.filterParamsToDefaultVals[i]} placeholder="Максимальное включительное числовое значение" type="number" onChange={(e) => windowFilterAddStore.setFilterObjectParam(i, parseInt(e.target.value))} />
            </>);
            break;
          }

          case "minDateValue": {
            filterParamsInputs.push(<>
              <p>Минимальное значение даты (в формате дд.мм.гггг):</p>
              <input className="bp5-input bp5-intent-primary" defaultValue={windowFilterAddStore.filterParamsToDefaultVals[i]} placeholder="Минимальное включительное значение даты" type="text" onChange={(e) => windowFilterAddStore.setFilterObjectParam(i, e.target.value)} />
            </>);
            break;
          }

          case "maxDateValue": {
            filterParamsInputs.push(<>
              <p>Максимальное значение даты (в формате дд.мм.гггг):</p>
              <input className="bp5-input bp5-intent-primary" defaultValue={windowFilterAddStore.filterParamsToDefaultVals[i]} placeholder="Максимальное включительное значение даты" type="text" onChange={(e) => windowFilterAddStore.setFilterObjectParam(i, e.target.value)} />
            </>);
            break;
          }

          case "value": {
            filterParamsInputs.push(<>
              <p>Текстовое значение:</p>
              <input className="bp5-input bp5-intent-primary" defaultValue={windowFilterAddStore.filterParamsToDefaultVals[i]} placeholder="Текстовое значение" type="text" onChange={(e) => windowFilterAddStore.setFilterObjectParam(i, e.target.value)} />
            </>);
            break;
          }

          case "valueBool": {
            filterParamsInputs.push(<>
              <p>Логическое значение:</p>
              <select  defaultValue={windowFilterAddStore.filterParamsToDefaultVals[i]} name="select" onChange={(e) => windowFilterAddStore.setFilterObjectParam(i, e.target.value == "true")}>
                <option value={"false"}>Нет</option>
                <option value={"true"}>Да</option>
              </select>
              </>);
            break;
          }

          case "isInverted": {
            filterParamsInputs.push(<>
              <p>Пропускать только не прошедшие фильтр записи (инвертированный фильтр):</p>
              <select defaultValue={windowFilterAddStore.filterParamsToDefaultVals[i]} name="select" onChange={(e) => windowFilterAddStore.setFilterObjectParam(i, e.target.value == "true")}>
                <option value={"false"}>Нет</option>
                <option value={"true"}>Да</option>
              </select>
            </>);
            break;
          }

          // TODO: специальный select для типов записи с "магическими числами" 
          // TODO: все починить и протестировать (особенно фильтр по диапозону дат)
          default: {
            break;
          }
        }
      }
      
      let filterTabsOptions = [];
      for (const i in windowFilterAddStore.filterTypeToDisplayTextMap) {
        filterTabsOptions.push(<>
          <option value={i}>{windowFilterAddStore.filterTypeToDisplayTextMap[i]}</option>
        </>);
      }
      return (
        <ModalWindowWithFooter title="Добавление фильтра" onClose={modalWindowsManagerStore.close}>
          <InputsContainerDiv>
            <p>Выберите тип фильра:</p>

            <select value={windowFilterAddStore.filterType} name="select" onChange={(e) => windowFilterAddStore.setFilterType(e.target.value)}>
              {filterTabsOptions}
            </select>

            <p>Настройки, перечисленные ниже, актуальны для указанного типа фильтра.</p>

            {filterParamsInputs}

            <Button intent="primary" onClick={windowFilterAddStore.save}>Сохранить</Button>
          </InputsContainerDiv>
        </ModalWindowWithFooter>
      );
      break;
    case "error":
      return (
        <ModalWindowWithFooter title="Добавление фильтра" onClose={modalWindowsManagerStore.close}>
          <InputsContainerDiv>
            <p>Ошибка: что-то пошло не так</p>
            <Button intent="primary" onClick={windowFilterAddStore.reset}>Попробовать еще раз</Button>
          </InputsContainerDiv>
        </ModalWindowWithFooter>
      );
      break;
    default:
      return (<></>);
      break;
  }
});

export default WindowAssocEditor;