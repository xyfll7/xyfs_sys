
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

    const count = sheet.data.reduce((ccc, iii, index) => {

      if (iii[12]?.includes("邮政")) {
        return ccc += 1;
      } else {
        return ccc;
      }

    }, 0);
    if (count > 0)
      console.log(`${index},${sheet.data?.[1]?.join(',')},count:${count}`);
  });

} catch (err) {
  console.log(err);
}





