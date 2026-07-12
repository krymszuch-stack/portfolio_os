const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('./src/components', (filePath) => {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix labels: change <label to <span and </label> to </span>
    content = content.replace(/<label\b/g, '<span');
    content = content.replace(/<\/label>/g, '</span>');

    fs.writeFileSync(filePath, content);
  }
});
