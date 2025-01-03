import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import styled from "styled-components";
import { noteTabStore } from "../../../stores/tabsStores/NoteTabStore.js";
import {
    Button,
    ButtonGroup,
    TextArea,
    Text,
    InputGroup,
    Checkbox,
    TagInput,
    FileInput,
    NumericInput
} from "@blueprintjs/core";
import { modalWindowsManagerStore } from "../../../stores/ModalWindowsManagerStore.js";

let SourceTextEditorContainer = styled.div`
    width: 100%;

    & > textarea {
        min-width: 100% !important;
        width: 100% !important;
        min-height: 700em;
    }

    & > br {
        user-select: none;
    }
`;

let ContainerForInputs = styled.div`
    padding-left: 0.5em;
    padding-right: 0.5em;

    & > * {
        margin-top: 0.7em;
        user-select: none;
    }

    & > * > input {
        user-select: unset;
    }

    & > * > * {
        outline: 0 !important;
    }
`;

let NoteEditMode = observer(() => {
    return (<>
        <SourceTextEditorContainer>
            <br />
            <ContainerForInputs>
                <ButtonGroup large={true} alignText="center">
                    <Button icon="document-share" onClick={() => { modalWindowsManagerStore.open("WindowSaveTemplate") }}>Сохранить как шаблон</Button>
                    <Button icon="document" onClick={() => { modalWindowsManagerStore.open("WindowTemplates") }}>Шаблоны</Button>
                </ButtonGroup>
                
                <Text>Название записи:</Text>
                <InputGroup placeholder="Название записи" intent="primary" value={noteTabStore.noteObject.name} onInput={noteTabStore.noteNameInputEventHandler}></InputGroup>

                <Checkbox checked={noteTabStore.noteObject.isPrimary} label="Добавить в избранные записи" onChange={noteTabStore.noteIsPrimaryChangeEventHandler} />

                <Text>Псевдонимы записи: (нажимайте клавишу "ввод" для сохранения каждого псведонима)</Text>
                <TagInput placeholder="Псевдонимы записи" intent="primary" fill={true} values={noteTabStore.noteObject.aliasesList} onChange={noteTabStore.noteAliasesListChangeEventHandler} />

                {/*<Checkbox checked={noteTabStore.noteObject.hasHistoricalDate} label="Добавить дату (указанная дата также должна быть включенна в название записи в скобках, в формате (дд.мм.гггг), (мм.гггг) или (гггг))" onChange={noteTabStore.noteHasHistoricalDateChangeEventHandler} /> */}
                <Text>Семантическая дата (дата, начиная с которой запись будет считаться актуальной):</Text>
                <Text>Уровень точности даты:</Text>
                <select style={{ width: "100%" }} disabled={!noteTabStore.noteObject.hasHistoricalDate} onChange={noteTabStore.noteHistoricalDateAccuracyLevelChangeEventHandler} >
                    <option value="1" selected={noteTabStore.noteObject.historicalDateAccuracyLevel_1_2_3 == 1}>1. Низкий</option>
                    <option value="2" selected={noteTabStore.noteObject.historicalDateAccuracyLevel_1_2_3 == 2}>2. Средний</option>
                    <option value="3" selected={noteTabStore.noteObject.historicalDateAccuracyLevel_1_2_3 == 3}>3. Высокий</option>
                </select>
                <Text>Год:</Text>
                <NumericInput intent="primary" disabled={!noteTabStore.noteObject.hasHistoricalDate} value={noteTabStore.currentNoteHistoricalDate.year} onValueChange={(v) => { noteTabStore.setNoteHistoricalDatePart(v, "year") }} />
                <Text>Месяц:</Text>
                <NumericInput min={1} max={12} intent="primary" disabled={!noteTabStore.noteObject.hasHistoricalDate} value={noteTabStore.currentNoteHistoricalDate.month} onValueChange={(v) => { noteTabStore.setNoteHistoricalDatePart(v, "month") }} />
                <Text>День:</Text>
                <NumericInput min={1} max={31} intent="primary" disabled={!noteTabStore.noteObject.hasHistoricalDate} value={noteTabStore.currentNoteHistoricalDate.day} onValueChange={(v) => { noteTabStore.setNoteHistoricalDatePart(v, "day") }} />

                {/*<br />
                <Text>Количество ассоциаций у этой записи: {noteTabStore.noteObject.associatedNotesIds.length}</Text>
                <Button intent="primary" onClick={() => { modalWindowsManagerStore.open("WindowAssocEditor"); }}>Открыть редактор ассоциаций</Button> */}

                <Text>Добавление файлов (видео желательно в формате webm или mp4): (для каждого файла в текст записи будет добавлен свой код)</Text>
                <FileInput buttonText="Выбрать" disabled={noteTabStore.isFileUploadLoading} text={noteTabStore.isFileUploadLoading ? "Загрузка..." : "Выберите файл"} onInputChange={noteTabStore.selectFileEventHandler} />
            </ContainerForInputs>
            <br />

            <TextArea
                intent="primary"
                autoResize={false}
                large={true}
                value={noteTabStore.noteObject.sourceText}
                onInput={noteTabStore.noteTextInputEventHandler}
                onKeyDown={noteTabStore.noteTextOnKeyDownEventHandler}
            >

            </TextArea>
        </SourceTextEditorContainer>
        <br />
    </>);
});

export default NoteEditMode;