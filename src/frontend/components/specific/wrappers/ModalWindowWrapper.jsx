import React from "react";
import { observer } from "mobx-react-lite";

import WindowLoginError from "../modalWindows/WindowLoginError.jsx";
import WindowOpenNoteById from "../modalWindows/WindowOpenNoteById.jsx";
import WindowNoteNotExistError from "../modalWindows/WindowNoteNotExistError.jsx";
import WindowGC from "../modalWindows/WindowGC.jsx";
import WindowDBStatus from "../modalWindows/WindowDBStatus.jsx";
import WindowChangePassword from "../modalWindows/WindowChangePassword.jsx";
import WindowInfo from "../modalWindows/WindowInfo.jsx";
import WindowSaveTemplate from "../modalWindows/WindowSaveTemplate.jsx";
import WindowTemplates from "../modalWindows/WindowTemplates.jsx";
import WindowError from "../modalWindows/WindowError.jsx";
import WindowAssocEditor from "../modalWindows/WindowAssocEditor.jsx";

import { modalWindowsManagerStore } from "../../../stores/ModalWindowsManagerStore.js";
import WindowOpenNoteByName from "../modalWindows/WindowOpenNoteByName.jsx";
import WindowFilterAdd from "../modalWindows/WindowFilterAdd.jsx";

let ModalWindowWrapper = observer(() => {
    let jsx = [];

    switch (modalWindowsManagerStore.type) {
        case "WindowLoginError":
            jsx.push(<WindowLoginError />);
            break;
        case "WindowOpenNoteById":
            jsx.push(<WindowOpenNoteById />);
            break;
        case "WindowNoteNotExistError":
            jsx.push(<WindowNoteNotExistError />);
            break;
        case "WindowGC":
            jsx.push(<WindowGC />);
            break;
        case "WindowDBStatus":
            jsx.push(<WindowDBStatus />);
            break;
        case "WindowChangePassword":
            jsx.push(<WindowChangePassword />);
            break;
        case "WindowInfo":
            jsx.push(<WindowInfo />);
            break;
        case "WindowSaveTemplate":
            jsx.push(<WindowSaveTemplate />);
            break;
        case "WindowTemplates":
            jsx.push(<WindowTemplates />);
            break;
        case "WindowError":
            jsx.push(<WindowError />);
            break;
        case "WindowAssocEditor":
            jsx.push(<WindowAssocEditor />);
            break;
        case "WindowOpenNoteByName":
            jsx.push(<WindowOpenNoteByName />);
            break;
        case "WindowFilterAdd":
            jsx.push(<WindowFilterAdd />);
            break;
        default:
            jsx.push(<></>);
            break;
    }

    return jsx;
});

export default ModalWindowWrapper;