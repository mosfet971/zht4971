import { makeAutoObservable, runInAction } from "mobx";
import { modalWindowsManagerStore } from "../ModalWindowsManagerStore";
import { tabsManagerStore } from "../TabsManagerStore";
import * as filesFrontendUtils from "../../utils/filesFrontendUtils";
import * as noteObjectRenderer from "../../utils/noteObjectRenderer";

class ListTabStore {
    constructor() {
        makeAutoObservable(this);
    }

    status = "loading"; // loading, ready 
    listOfNoteCardsHtml = "";
    sortMode = "byGetTime"; // byCreationTime, byGetTime, byEditionTime, byHistDate
    sortOrder = "bToA"; // aToB, bToA
    filtersList = [];

    paramToDisplayText = {
        "nameOrAliasFilterFuse": "Нечеткое влючение текста в названии или псевдонимах",
        "stringFuse": "Нечеткое включение текста в текстовом параметре или списке",
        "stringStrict": "Включение текста в текстовом параметре или списке",
        "stringInList": "Включение текста в списке",
        "range": "Диапазон числового значения параметра",
        "rangeLength": "Диапазон длинны текстового значения или списка",
        "bool": "Логическое значение",
        "ddmmggggFilter": "Диапозон даты в формате дд.мм.гггг",
        "noteTypeNumberRangeFilter": "Диапазон типов",
        "id": "Идентификатор",
        "name": "Название",
        "aliasesList": "Список псевдонимов",
        "isPrimary": "Избранность",
        "noteTypeNumber": "Тип записи в виде числа",
        "tagsNotesListIds": "",
        "lastGetTime": "Время предыдущего открытия ",
        "creationTime": "Время создания",
        "editionTime": "Время изменения",
        "hasHistoricalDate": "Наличие дополнительной даты",
        "historicalDateNumber": "Дополнительная дата",
        "historicalDateAccuracyLevel_1_2_3": "Уровень точности дополнительной даты (1, 2, 3)",
        "sourceText": "Исходный текст записи",
        "taggedNotesIds": "",
        "associatedNotesIds": "Список ассоциированных записей (названия и псевдонимы)",
        "type": "Тип фильтра",
        "paramName": "Свойство",
        "minValue": "Минимальное включительное числовое значение",
        "maxValue": "Максимальное включительное числовое значение",
        "isInverted": "Инверсия",
        "value": "Текстовое значение",
        "valueBool": "Логическое значение",
        "minDateValue": "Минимальная включительная дата",
        "maxDateValue": "Максимальная включительная дата",
        "minNoteTypeNumberValue": "Минимальный включительный числовой тип записи",
        "maxNoteTypeNumberValue": "Максимальный включительный числовой тип записи",
        "true": "Да",
        "false": "Нет"
    };

    reset = async () => {
        this.status = "loading";
        this.listOfNoteCardsHtml = "";
        this.sortMode = "byGetTime"; 
        this.sortOrder = "bToA";
        this.filtersList = [];
        await this.fetch();
    };

    fetch = async () => {
        await runInAction(()=>{this.status="loading"});


        console.log(this.filtersList)
        let objs = await ipcRenderer.invoke("getNotesList", {sortMode: this.sortMode, sortOrder: this.sortOrder, filtersList: JSON.parse(JSON.stringify(this.filtersList))})

        this.listOfNoteCardsHtml = "";
        for (const i of objs) {
            this.listOfNoteCardsHtml += `<div style='justify-content: space-between;' class='bp5-card bp5-interactive' ` +  `onclick='window.openNoteById(`+ '"' + i.id + '"' + `)'>` + i.name + "<span class='bp5-icon-standard bp5-icon-document-open'></span></div>"
        }

        if (this.listOfNoteCardsHtml == "") {
            this.listOfNoteCardsHtml = "<h4 style='margin: 1em'>Ничего не найдено</h4>";
        }

        await runInAction(()=>{this.status="ready"});
    };

    sortModeChangeHandler = async (e) => {
        this.sortMode = e.target.value;
    };

    sortOrderChangeHandler = async (e) => {
        this.sortOrder = e.target.value;
    };

    openFiltersWindow = async () => {
        modalWindowsManagerStore.open("WindowFilterAdd");
    };

    addFilter = async (filterObject) => {
        this.filtersList.push(filterObject);
    }

    rmFilter = async (filterObject) => {
        this.filtersList = this.filtersList.filter((v)=>!(JSON.stringify(v) === JSON.stringify(filterObject)));
    };
}

export const listTabStore = new ListTabStore();