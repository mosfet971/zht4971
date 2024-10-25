import React from "react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import styled from "styled-components";
import MenuCard from "../../universal/MenuCard.jsx";
import { modalWindowsManagerStore } from "../../../stores/ModalWindowsManagerStore.js";
import { noteTabStore } from "../../../stores/tabsStores/NoteTabStore.js";
import { tabsManagerStore } from "../../../stores/TabsManagerStore.js";
import markdownit from "markdown-it";

const md = markdownit({ html: true, linkify: false, typographer: true });

import {
    IconFilePlus,
    IconHelp,
    IconLock,
    IconReportAnalytics,
    IconFileSymlink,
    IconRecycle
} from '@tabler/icons-react';



let InfoTextContainer = styled.div`
    letter-spacing: .01em; 
    word-break: normal; 
    max-width: 90%; 
    margin-left: 3em;
    margin-right: 1em;
    margin-top: 1em;
    margin-bottom: 1em;
    font-size: 125%;
`;

let text = `
# Справочник


## О программе в целом

zht4971 является программой для сохранения (преимущественно) текстовой и прочей информации,
а также обеспечения удобного доступа к ней. 
Основная единица хранения информации в программе - запись.
Запись представляет собой объект с рядом свойств, среди которых есть такие, как:
название записи, список псевдонимов записи, основной текст, список ассоциированных с этой записью 
записей, даты и т.д. Различными средствами, программа предоставляет возможность
осуществления ассоциативного
и прямого доступа к записям (для их просмотра и изменения).

Средства ассоциативного доступа:

- Списки ассоциаций с другими записями для каждой записи
- Ссылки в основном тексте записей

Средства прямого доступа:

- Список всех записей с настраиваемыми фильтрами и параметрами сортировки
- Список избранных записей с настраиваемыми параметрами сортировки
- Некоторые функции в главном меню

## Инструкции

- Для того, чтобы из текста записи дать ссылку на другую запись, нужно написать ее название или
псевдоним в двойных квадратных скобках. Пример: [[x]], где x - название или псевдоним записи, на
которую планируется дать ссылку. Отображаемый текст ссылки можно задать через символ "|". Пример:
[[x|y]], где x - название или псевдоним записи, на которую планируется дать ссылку, а y - текст,
которым будет написана ссылка.

- Для создания записи нужно воспользоваться соответствующей функцией в главном меню.
`;

let InfoTab = observer(() => {
    let renderedText = md.render(text);
    return (
        <InfoTextContainer dangerouslySetInnerHTML={{__html: renderedText}}>
        </InfoTextContainer>
    );
});

export default InfoTab;