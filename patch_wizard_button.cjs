const fs = require('fs');
let code = fs.readFileSync('src/components/Wizard.tsx', 'utf8');

code = code.replace(/\{step < 4 \? \(/g, '{step < 5 ? (');

fs.writeFileSync('src/components/Wizard.tsx', code);
