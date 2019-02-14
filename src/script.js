const fs = require('fs');
const path =require('path');

const SRC = path.join(__dirname, 'km_photos');
const files = fs.readdirSync(SRC);
files.forEach((filename, i) => {
  fs.renameSync(path.join(SRC, filename), path.join(SRC, i + 1 + '.jpg'));
});
