import { copyFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import AdmZip from 'adm-zip';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

var zip = new AdmZip(path.join(__dirname, "/model.json.zip"));
zip.extractAllTo(path.join(__dirname, "/"), true);
