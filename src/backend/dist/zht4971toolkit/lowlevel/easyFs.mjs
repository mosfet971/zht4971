import path from 'path';
import fs from 'fs';
let exp = {};
//изменить файл (или создать и изменить если его нет)
exp.writeTextToFile = function (filePath, text) {
    fs.writeFileSync(filePath, text, { flag: 'w', encoding: 'utf8' });
};
exp.writeBufferToFile = function (filePath, buffer) {
    fs.writeFileSync(filePath, buffer, { flag: 'w' });
};
//удалить файл
exp.rmFile = function (filePath) {
    fs.rmSync(filePath);
};
//получить текст из файла
exp.getFileText = function (filePath) {
    let text = fs.readFileSync(filePath, { flag: 'r', encoding: 'utf8' });
    return (text);
};
// получить буфер из файла
exp.getFileBuffer = function (filePath) {
    let buffer = fs.readFileSync(filePath, { flag: 'r' });
    return (buffer);
};
//проверить сушествует ли файл
exp.checkFile = function (filePath) {
    return (fs.existsSync(filePath));
};
//создать папку
exp.mkDir = function (filePath) {
    fs.mkdirSync(filePath, { recursive: true });
};
//удалить папку
exp.rmDir = function (filePath) {
    fs.rmSync(filePath, { recursive: true, force: true });
};
export default exp;
