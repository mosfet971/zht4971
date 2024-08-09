import React from "react";
import Draggable from 'react-draggable';
import { Dialog, DialogBody } from "@blueprintjs/core";


let ModalWindowWithFooter = (props) => {
    return (
        <Dialog style={{userSelect: "none"}} className="bp5-dark" isOpen={true} onClose={props.onClose} title={props.title}>
            <DialogBody>
                {props.children}
            </DialogBody>
        </Dialog>
    );
};

export default ModalWindowWithFooter;