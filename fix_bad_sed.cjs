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

    // Revert the bad sed
    content = content.replace(/<!--label--><div/g, '<label');
    content = content.replace(/<\/div><!--\/label-->/g, '</label>');

    // Apply the good sed
    content = content.replace(/<label\b/g, '<span');
    content = content.replace(/<\/label>/g, '</span>');

    fs.writeFileSync(filePath, content);
  }
});
