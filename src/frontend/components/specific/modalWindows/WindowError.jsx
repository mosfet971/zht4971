import React from "react";
import { observer } from "mobx-react-lite";
import ModalWindowWithFooter from "../../universal/ModalWindowWithFooter.jsx"
import { modalWindowsManagerStore } from "../../../stores/ModalWindowsManagerStore.js";

let WindowError = observer(() => {
  return (
    <ModalWindowWithFooter title="Ошибка" onClose={modalWindowsManagerStore.close}>
      <p style={{fontSize: "medium"}}>{modalWindowsManagerStore.value}</p>
    </ModalWindowWithFooter>
    );
});

export default WindowError;