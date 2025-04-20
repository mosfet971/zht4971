import { copyFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const directories = (source => readdirSync(source, { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name))(path.join(__dirname, "./out/"));

for (const dir of directories) {
    copyFileSync(path.join(__dirname, "./model.json"), path.join(__dirname, "./out/" + dir + "/model.json"));
}