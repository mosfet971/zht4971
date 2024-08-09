import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import ModalWindow from "../../universal/ModalWindow.jsx"
import styled from "styled-components";
import { windowOpenNoteByIdStore } from "../../../stores/modalWindowsStores/WindowOpenNoteByIdStore.js";
import { modalWindowsManagerStore } from "../../../stores/ModalWindowsManagerStore.js";
import { InputGroup, Button } from "@blueprintjs/core";


let WindowOpenNoteById = observer(() => {
  useEffect(() => {
    windowOpenNoteByIdStore.reset();
  }, []);
  
  return (
    <ModalWindow title="Открытие записи" onClose={modalWindowsManagerStore.close}>
      <p style={{ width: "20em", fontSize: "large" }}>Введите идентификатор записи:</p>
      <div>
        <InputGroup 
          type="text" 
          onInput={windowOpenNoteByIdStore.idInputOninputHandler} 
          placeholder="идентификатор"
          onKeyDown={(e)=>{e.key == "Enter" ? windowOpenNoteByIdStore.submit() : false}}
        />
        <br/>
        <Button onClick={windowOpenNoteByIdStore.submit}>Открыть</Button>
      </div>
    </ModalWindow>
  );
});

export default WindowOpenNoteById;