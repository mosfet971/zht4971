import React from "react";
import { observer } from "mobx-react-lite";
import ModalWindowWithFooter from "../../universal/ModalWindowWithFooter.jsx"
import { modalWindowsManagerStore } from "../../../stores/ModalWindowsManagerStore.js";

let WindowAssocEditor = observer(() => {
  return (
    <ModalWindowWithFooter title="Редактор ассоциаций" onClose={modalWindowsManagerStore.close}>
      <p style={{fontSize: "medium"}}>фывфыввфывф</p>
    </ModalWindowWithFooter>
    );
});

export default WindowAssocEditor;