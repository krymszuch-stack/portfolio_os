const fs = require('fs');

function fixFile(file, edits) {
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

fixFile('src/components/AppProjects.tsx', [
    { find: /<input([^>]*?)type="text"([^>]*?)value={addForm.url}/g, replace: '<label htmlFor="addFormUrl" className="sr-only">URL</label>\n<input id="addFormUrl"$1type="text"$2value={addForm.url}' },
    { find: /<input([^>]*?)type="text"([^>]*?)value={addForm.title}/g, replace: '<label htmlFor="addFormTitle" className="sr-only">Title</label>\n<input id="addFormTitle"$1type="text"$2value={addForm.title}' },
    { find: /<textarea([^>]*?)value={addForm.description}/g, replace: '<label htmlFor="addFormDescription" className="sr-only">Description</label>\n<textarea id="addFormDescription"$1value={addForm.description}' },
    { find: /<input([^>]*?)type="text"([^>]*?)value={addForm.tags}/g, replace: '<label htmlFor="addFormTags" className="sr-only">Tags</label>\n<input id="addFormTags"$1type="text"$2value={addForm.tags}' }
]);

fixFile('src/components/AppCertificates.tsx', [
    { find: /<input([^>]*?)type="text"([^>]*?)value={addForm.title}/g, replace: '<label htmlFor="addCertTitle" className="sr-only">Title</label>\n<input id="addCertTitle"$1type="text"$2value={addForm.title}' },
    { find: /<input([^>]*?)type="text"([^>]*?)value={addForm.issuer}/g, replace: '<label htmlFor="addCertIssuer" className="sr-only">Issuer</label>\n<input id="addCertIssuer"$1type="text"$2value={addForm.issuer}' },
    { find: /<input([^>]*?)type="month"([^>]*?)value={addForm.date}/g, replace: '<label htmlFor="addCertDate" className="sr-only">Date</label>\n<input id="addCertDate"$1type="month"$2value={addForm.date}' },
    { find: /<textarea([^>]*?)value={addForm.description}/g, replace: '<label htmlFor="addCertDescription" className="sr-only">Description</label>\n<textarea id="addCertDescription"$1value={addForm.description}' }
]);

fixFile('src/App.tsx', [
    { find: /catch \(e\) \{\}/g, replace: 'catch (e) { /* ignore */ }' },
    { find: /const \[sprints, setSprints\] = useState\(initialSprints\);/g, replace: 'const [, setSprints] = useState(initialSprints);' }
]);

console.log("Lint patch applied");
