import React from "react";
import styled from "styled-components";

let MenuCardButton = styled.button`
    width: 7em;
    height: 5em;
    text-align: center;
    //padding: 1em;
    margin: 0.3em;
    font-size: 200%;
    user-select: none;

    display: flex;
    flex-direction: column;
`;

let MenuCard = (props) => {
    return (
        <MenuCardButton className="bp5-button" onClick={props.handler}>
            {props.children}
        </MenuCardButton>
    );
};

export default MenuCard;