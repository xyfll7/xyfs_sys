import fs from 'fs';
import xlsx from 'node-xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dir = './test/';
const files = fs.readdirSync(dir);
try {
  // Postal_Order_Form();
  Salary_Statistics_Table();
} catch (err) {
  console.log(err);
}

function Salary_Statistics_Table() {
  const strs = [`序号,站点名称,总计,总计金额,,快递金额,,干洗金额,重量差,重量差扣款`];
  files.filter(e => e.includes(".csv")).forEach((file, index) => {
    const workSheetsFromFile = xlsx.parse(`${__dirname}/${dir}/${file}`);
    const sheet = workSheetsFromFile[0];
    const count = sheet.data.reduce((ccc, iii, index) => {
      if (Number(iii[8])) {
        if (Number(iii[8]) < -1) {
          ccc[0] += Number(iii[8]);
          ccc[1] += -(Number(iii[8]) * 1.5);
        }
      }
      return ccc;
    }, [0, 0]);

    if (count) {
      strs.push(`${index += 1},${sheet.data?.[0]?.join(',')},${count.join(',')}`);
    }
  });
  const result = strs.join('\n');
  fs.writeFileSync(`${__dirname}/_test_result.csv`, result);
  console.log("_test_result.csv,Done!");
}
function Postal_Order_Form() {

  const strs = [];
  files.filter(e => e.includes(".csv")).forEach((file, index) => {
    const workSheetsFromFile = xlsx.parse(`${__dirname}/${dir}/${file}`);
    const sheet = workSheetsFromFile[0];
    const count = sheet.data.filter((iii, index) => {
      if (iii[15]?.includes("邮政")) {
        return true;
      }
      return false;
    });
    console.log(count[0]);
    if (count[0]) {
      strs.push(`${count[0].join(',')}`);
    }
  });
  const result = strs.join('\n');
  fs.writeFileSync(`${__dirname}/_test_postal.csv`, result);
  console.log("Done!");
}