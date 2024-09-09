import React from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { loginStore } from "../../../stores/LoginStore";
import { useEffect } from "react";

let LoginForm = styled.div`
  max-width: 35em;
  height: auto;
  display: block;
  padding: 2em;


  &>div>h2 {
    margin: 0;
    user-select: none;
  }

  &>div>p {
    margin-bottom: 0.5em;
    font-size: medium;
    user-select: none;
  }

  &>div {
    display: flex;
    flex-direction: column;
    height: 30%;
    width: 100%;
    z-index: 1;
  }

  &>div>*{
    margin-bottom: 3em;
    grid-row: 2;
  }

  &>div>.line{
    border-top: 0.05em solid #838383;
    height: 0;
    margin-bottom: 2.5em;
    margin-top: 0.5em;
  }

  &>div>button{
    margin-bottom: 0;
    font-size: 120%;
    height: 2em;
    width: 40%;
    align-self: center;
  }
  
  &>div>input {
    font-size: 120%;
    height: 2em;
    align-self: center;
    width: 100%;
    margin-bottom: 2em;
  }

`;

let Container = styled.div`
  width: 100vw;
  height: 100vh;
  z-index: 5;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
`;


let LoginPage = observer(() => {
  useEffect(() => {
    loginStore.reset();
  }, []);

  return (
    <Container>
      <LoginForm className="bp5-card bp5-elevation-4">
        <div>
          <h2><b>
            Введите пароль
          </b>
          </h2>
          <p>
            Если база данных ещё не созданна, она будет инициализированна с указанным паролем.
          </p>

          <div className="line"></div>
          <input
            id="passwordInput"
            className="bp5-input"
            type="password"
            onInput={(e) => loginStore.updatePassword(e.target.value)}
            placeholder="Пароль"
            onKeyDown={(e) => { e.key == "Enter" ? loginStore.login() : false }}
          />
          <button className="bp5-button bp5-intent-warning" onClick={() => loginStore.login()}>Войти</button>
        </div>
      </LoginForm>
    </Container>);
});

export default LoginPage;