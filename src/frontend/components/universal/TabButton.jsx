import React from "react";
import styled from "styled-components";


let TabButton = (props) => {
    return (
        <li className="bp5-tab" style={{userSelect: "none"}} role="tab" aria-controls={props.target} aria-selected={props.isDefaultSelected.toString()}>{props.children}</li>
    );
};

export default TabButton;