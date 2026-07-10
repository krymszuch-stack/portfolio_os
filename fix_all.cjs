const fs = require('fs');

function fix(file, edits) {
    let code = fs.readFileSync(file, 'utf8');
    for (const edit of edits) {
        if (typeof edit === 'function') {
            code = edit(code);
        } else {
            code = code.replace(edit.find, edit.replace);
        }
    }
    fs.writeFileSync(file, code);
}

// Ensure unique ids for labels in forms
fix('src/components/AppProjects.tsx', [
    { find: /<input\s+id="addFormUrl"/g, replace: '<input id="addFormUrl"' },
    { find: /<label htmlFor="addFormUrl" className="text-\[10px\] text-slate-400 uppercase font-mono">Adres URL \(Opcjonalnie\)<\/label>\n\s*<input/g, replace: '<label htmlFor="addFormUrl" className="text-[10px] text-slate-400 uppercase font-mono">Adres URL (Opcjonalnie)</label>\n<input' }
]);
