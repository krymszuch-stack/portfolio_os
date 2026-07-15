const fs = require('fs');
const path = 'src/components/contact/ContactInfo.tsx';
let code = fs.readFileSync(path, 'utf8');

// Email
code = code.replace(
  /<div className="w-12 h-12 rounded-full bg-amber-500\/10 text-amber-500 flex items-center justify-center shrink-0">/,
  '<div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300">'
);
// Make the container group and clickable
code = code.replace(
  /<div className="flex items-center gap-4 bg-white\/5 border border-white\/10 rounded-2xl p-4">/g,
  '<div className="group flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all duration-300 relative">'
);

// Add copy button to Email
if (!code.includes('onClick={() => handleCopy(')) {
  code = code.replace(
    /<p className="text-sm font-medium text-white break-all">([^<]+)<\/p>/,
    `<p className="text-sm font-medium text-white break-all pr-8">$1</p>
              <button
                onClick={(e) => { e.preventDefault(); handleCopy($1, 'email'); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                title="Kopiuj email"
              >
                {copiedType === 'email' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>`
  );

  // Add copy button to Phone
  code = code.replace(
    /\{config.phone\}/,
    `{config.phone}</p>
              <button
                onClick={(e) => { e.preventDefault(); handleCopy(config.phone || '', 'phone'); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                title="Kopiuj telefon"
              >
                {copiedType === 'phone' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>`
  );
}

fs.writeFileSync(path, code);
