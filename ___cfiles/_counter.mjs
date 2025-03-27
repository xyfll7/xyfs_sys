
import fs from 'fs';
import xlsx from 'node-xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// directory path
const dir = './test_1/';

// list all files in the directory
try {
  const files = fs.readdirSync(dir);

  // files object contains all files names
  // log them on console
  console.log(`序号,站点名称,总计,总计金额,,快递金额,,干洗金额`);
  files.forEach((file, index) => {
    // if (index !== 3) { return; }
    const workSheetsFromFile = xlsx.parse(`${__dirname}/${dir}/${file}`);
    const sheet = workSheetsFromFile[0];

    const count = sheet.data.reduce((ccc, iii, index) => {

      if (Number(iii[8])) {
        // console.log(iii[8], Number(iii[8]));
        if (Number(iii[8]) < -1) {
          ccc[0] += Number(iii[8]);
          ccc[1] += -(Number(iii[8]) * 1.5);
        }
      }

      return ccc;
    }, [0, 0]);
    if (count) {
      // console.log(count);
      console.log(`${index += 1},${sheet.data?.[1]?.join(',')},${count.join(',')}`);
    }

  });

} catch (err) {
  console.log(err);
}



