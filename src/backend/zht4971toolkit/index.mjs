import database from "./lowlevel/database.mjs";

import NotesTools from "./sections/NotesTools.mjs";
import FilesTools from "./sections/FilesTools.mjs";
import TemplatesTools from "./sections/TemplatesTools.mjs";
import NotesSearchTools from "./sections/NotesSearchTools.mjs"
import Utils from "./sections/Utils.mjs";

/*
На бэкенде:
    - реализовать функцию копирования программы

На фронтенде:
    - обеспечить рендеринг записи из данных (markdown, ссылки, файлы, 
    уведомление о устаревании и т.д.)
    - обеспечить добавление ассоциаций
    - обеспечить добавление тегов-записей, их поиск и возможность быстрого создания
      без выхода из интерфейса редактирования данных записи
    - обеспечить защиту от попытки изменения записи, приводящей
      к конфликту названий или псевдонимов
    - обеспечить защиту от попытки изменения записи, приводящей
      к отсутствию исторической даты в названии, при ее наличии в данных
    - обеспечить работу с исторической датой (ее указание и выбор должна ли она
    быть указанна для конкретно этой записи или нет)
    - обрабатывать всевозможные исключения
    - обеспечить защиту от добавления в теги записи ее самой
*/


class ZhtToolkit {
    constructor(dbDirPath, password) {
        
        if(!database.checkExist(dbDirPath)) {
            database.create(dbDirPath, password);
        }

        let mk = database.getMasterKey(dbDirPath, password);

        this.notesTools = new NotesTools(dbDirPath, mk);
        this.filesTools = new FilesTools(dbDirPath, mk);
        this.templatesTools = new TemplatesTools(dbDirPath, mk);
        this.notesSearchTools = new NotesSearchTools(this.notesTools);
        this.utils = new Utils(this.notesTools, this.filesTools, dbDirPath, mk)
    }

    getNewId = ()=> {
        return database.newId();
    };
}

export default ZhtToolkit;