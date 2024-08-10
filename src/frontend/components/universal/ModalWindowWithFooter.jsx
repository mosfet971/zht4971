import React from "react";
import Draggable from 'react-draggable';
import { Dialog, DialogBody, DialogFooter, Button } from "@blueprintjs/core";


let ModalWindowWithFooter = (props) => {
    return (
        <Dialog transitionDuration={0} style={{userSelect: "none"}} className="bp5-dark" isOpen={true} onClose={props.onClose} title={props.title}>
            <DialogBody>
                {props.children}
            </DialogBody>
            <DialogFooter actions={<Button intent="none" text="Закрыть" onClick={props.onClose} />} />
        </Dialog>
    );
};

export default ModalWindowWithFooter;