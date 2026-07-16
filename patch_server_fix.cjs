const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Fix syntax error backtick issue
code = code.replace(/w polu `suggestedProfessionId`\./g, 'w polu "suggestedProfessionId".');

// Fix accidental duplication line
const duplicateLine = ' musi być szczegółowo opisany oraz zawierać powiązaną tablicę synonimów (synonyms), które pozwolą później na łączenie zmiennych (np. "React" ma synonimy ["ReactJS", "React.js", "Frontend", "JSX", "JavaScript UI"]).';
code = code.replace(duplicateLine, '');

fs.writeFileSync('server.ts', code);
