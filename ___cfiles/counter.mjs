
import fs from 'fs';
import xlsx from 'node-xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// directory path
const dir = './untitled_folder/';

// list all files in the directory
try {
  const files = fs.readdirSync(dir);

  // files object contains all files names
  // log them on console
  files.forEach((file, index) => {
    // if (index !== 3) { return; }
    const workSheetsFromFile = xlsx.parse(`${__dirname}/untitled_folder/${file}`);
    const sheet = workSheetsFromFile[0];

    const count = sheet.data.reduce((ccc, iii) => {

      if (iii[12]?.includes("极兔") || iii[12]?.includes("韵达") || iii[12]?.includes("申通")) {
        return ccc += 1;
      } else {
        return ccc;
      }

    }, 0);
    console.log(`${sheet.data?.[1]?.join(',')},${(count * 0.2).toFixed(0)}`);
  });

} catch (err) {
  console.log(err);
}





