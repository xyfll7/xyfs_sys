
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// directory path
const dir = './logo_wall/';

// list all files in the directory
try {
  const files = fs.readdirSync(dir);

  // files object contains all files names
  // log them on console
  files.forEach((file, index) => {
    console.log(file.split('.')[0].replace("@", '_'));
  });

} catch (err) {
  console.log(err);
}

