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

fix('src/components/AppProjects.tsx', [
    { find: /<input([^>]*?)type="text"([^>]*?)value={addForm.url}/g, replace: '<input id="addFormUrl"$1type="text"$2value={addForm.url}' },
    { find: /<input([^>]*?)type="text"([^>]*?)value={addForm.title}/g, replace: '<input id="addFormTitle"$1type="text"$2value={addForm.title}' },
    { find: /<textarea([^>]*?)value={addForm.description}/g, replace: '<textarea id="addFormDescription"$1value={addForm.description}' },
    { find: /<input([^>]*?)type="text"([^>]*?)value={addForm.tags}/g, replace: '<input id="addFormTags"$1type="text"$2value={addForm.tags}' },
    { find: /<label className="text-\[10px\] text-slate-400 uppercase font-mono">Adres URL \(Opcjonalnie\)<\/label>/g, replace: '<label htmlFor="addFormUrl" className="text-[10px] text-slate-400 uppercase font-mono">Adres URL (Opcjonalnie)</label>' },
    { find: /<label className="text-\[10px\] text-slate-400 uppercase font-mono">Tytuł projektu<\/label>/g, replace: '<label htmlFor="addFormTitle" className="text-[10px] text-slate-400 uppercase font-mono">Tytuł projektu</label>' },
    { find: /<label className="text-\[10px\] text-slate-400 uppercase font-mono">Krótki opis<\/label>/g, replace: '<label htmlFor="addFormDescription" className="text-[10px] text-slate-400 uppercase font-mono">Krótki opis</label>' },
    { find: /<label className="text-\[10px\] text-slate-400 uppercase font-mono">Tagi technologii<\/label>/g, replace: '<label htmlFor="addFormTags" className="text-[10px] text-slate-400 uppercase font-mono">Tagi technologii</label>' },
]);

fix('src/components/AppCertificates.tsx', [
    { find: /<input([^>]*?)type="text"([^>]*?)value={addForm.title}/g, replace: '<input id="addCertTitle"$1type="text"$2value={addForm.title}' },
    { find: /<input([^>]*?)type="text"([^>]*?)value={addForm.issuer}/g, replace: '<input id="addCertIssuer"$1type="text"$2value={addForm.issuer}' },
    { find: /<input([^>]*?)type="month"([^>]*?)value={addForm.date}/g, replace: '<input id="addCertDate"$1type="month"$2value={addForm.date}' },
    { find: /<textarea([^>]*?)value={addForm.description}/g, replace: '<textarea id="addCertDescription"$1value={addForm.description}' },
    { find: /<label className="text-\[10px\] text-slate-400 uppercase font-mono">Tytuł Certyfikatu<\/label>/g, replace: '<label htmlFor="addCertTitle" className="text-[10px] text-slate-400 uppercase font-mono">Tytuł Certyfikatu</label>' },
    { find: /<label className="text-\[10px\] text-slate-400 uppercase font-mono">Wystawca<\/label>/g, replace: '<label htmlFor="addCertIssuer" className="text-[10px] text-slate-400 uppercase font-mono">Wystawca</label>' },
    { find: /<label className="text-\[10px\] text-slate-400 uppercase font-mono">Data Wydania<\/label>/g, replace: '<label htmlFor="addCertDate" className="text-[10px] text-slate-400 uppercase font-mono">Data Wydania</label>' },
    { find: /<label className="text-\[10px\] text-slate-400 uppercase font-mono">Krótki opis<\/label>/g, replace: '<label htmlFor="addCertDescription" className="text-[10px] text-slate-400 uppercase font-mono">Krótki opis</label>' },
]);
