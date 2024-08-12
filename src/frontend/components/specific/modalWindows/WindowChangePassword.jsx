import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import ModalWindowWithFooter from "../../universal/ModalWindow.jsx"
import styled from "styled-components";
import { modalWindowsManagerStore } from "../../../stores/ModalWindowsManagerStore.js";
import { InputGroup, Button, ProgressBar } from "@blueprintjs/core";
import { windowChangePasswordStore } from "../../../stores/modalWindowsStores/WindowChangePasswordStore.js";

let WindowChangePassword = observer(() => {
    useEffect(() => {
        windowChangePasswordStore.reset();
    }, []);

    if (windowChangePasswordStore.status == "ready") {
        return (
            <ModalWindowWithFooter title="Смена пароля" onClose={modalWindowsManagerStore.close}>
                <InputGroup
                    type="password"
                    onInput={windowChangePasswordStore.oldPasswordInputHandler}
                    placeholder="старый пароль"
                />
                <br/>
                <InputGroup
                    type="password"
                    onInput={windowChangePasswordStore.newPasswordInputHandler}
                    placeholder="новый пароль"
                />
                <br/>
                <Button onClick={windowChangePasswordStore.submit}>Сменить пароль</Button>
            </ModalWindowWithFooter>
        );
    }
    else if (windowChangePasswordStore.status == "loading") {
        return (
            <ModalWindowWithFooter title="Смена пароля" onClose={modalWindowsManagerStore.close}>
                <p>Идет изменение пароля, пожалуйста подождите</p>
                <ProgressBar intent="primary" />
            </ModalWindowWithFooter>
        );
    } else if (windowChangePasswordStore.status == "finished") {
        return (
            <ModalWindowWithFooter title="Смена пароля" onClose={modalWindowsManagerStore.close}>
                <p>Пароль успешно изменен</p>
            </ModalWindowWithFooter>
        );
    } else if (windowChangePasswordStore.status == "error") {
        return (
            <ModalWindowWithFooter title="Смена пароля" onClose={modalWindowsManagerStore.close}>
                <p>Ошибка: неверный старый пароль</p>
                <Button onClick={windowChangePasswordStore.reset}>Попробовать еще раз</Button>
            </ModalWindowWithFooter>
        );
    }
});

export default WindowChangePassword;