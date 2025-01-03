import React from "react";
import { observer } from "mobx-react-lite";
import ModalWindowWithFooter from "../../universal/ModalWindowWithFooter.jsx"
import { modalWindowsManagerStore } from "../../../stores/ModalWindowsManagerStore.js";
import { windowAssocEditorStore } from "../../../stores/modalWindowsStores/WindowAssocEditorStore.js";
import { ProgressBar, Button, InputGroup, ButtonGroup, Tag } from "@blueprintjs/core";
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
          <p>Ассоциации: </p>
          <div style={{display: "flex", flexFlow: "row wrap"}} dangerouslySetInnerHTML={{__html: windowAssocEditorStore.tagsPreviewHtml}}></div>
          <br />
          <InputGroup
            id="assocEditorInputName"
            disabled={windowAssocEditorStore.isOpLoading}
            value={windowAssocEditorStore.nameOfTargetNote}
            type="text"
            onInput={windowAssocEditorStore.inputNameEventHandler}
            placeholder="Введите название или псевдоним целевой записи"
            onKeyDown={(e) => { e.key == "Enter" ? windowAssocEditorStore.add() : false }}
          />
          <br/>
          <ButtonGroup>
            <Button disabled={windowAssocEditorStore.isOpLoading} onClick={windowAssocEditorStore.remove} intent="danger">Удалить ассоциацию</Button>
            <Button disabled={windowAssocEditorStore.isOpLoading} onClick={windowAssocEditorStore.add} intent="primary">Добавить ассоциацию</Button>
          </ButtonGroup>
        </ModalWindowWithFooter>
      );
      break;
    case "finished":
      return (
        <ModalWindowWithFooter title="Редактор ассоциаций" onClose={modalWindowsManagerStore.close}>
          <p style={{ fontSize: "medium" }}>Готово</p>
        </ModalWindowWithFooter>
      );
      break;
    default:
      return (<></>);
      break;
  }
});

export default WindowAssocEditor;