const fs = require('fs');
const path = 'src/components/Wizard.tsx';
let code = fs.readFileSync(path, 'utf8');

// Increase steps in the dots progress from [1, 2, 3, 4] to [1, 2, 3, 4, 5]
code = code.replace(
  /\[1, 2, 3, 4\].map/g,
  '[1, 2, 3, 4, 5].map'
);

// Krok x/4 -> Krok x/5
code = code.replace(/Krok \{step\}\/4/g, 'Krok {step}/5');

// Find step 4 (which was summary)
const step4Regex = /\{step === 4 && \(/;

// Replace step === 4 with step === 5
code = code.replace(
  step4Regex,
  `{step === 4 && (
            <div className="space-y-4 animate-fadeIn text-left">
              <div className="space-y-1">
                <h3 className="text-base font-sans font-bold text-white">Weryfikacja danych</h3>
                <p className="text-xs text-slate-400">Sprawdź podsumowanie swojego profilu. W razie potrzeby możesz dokonać zmian później w Ustawieniach (App Settings).</p>
              </div>
              <div className="bg-slate-900/50 p-4 border border-white/10 rounded-xl space-y-3">
                <p className="text-xs text-slate-300"><strong>Imię i Nazwisko:</strong> {userName}</p>
                <p className="text-xs text-slate-300"><strong>Stanowisko:</strong> {config.title}</p>
                <p className="text-xs text-slate-300"><strong>Zidentyfikowane projekty:</strong> {projects?.length || 0}</p>
                <p className="text-xs text-slate-300"><strong>Zidentyfikowane wpisy doświadczenia:</strong> {timeline?.length || 0}</p>
                <p className="text-xs text-slate-300"><strong>Sugerowana kategoria:</strong> {selectedCategory.name}</p>
              </div>
            </div>
          )}
          {step === 5 && (`
);

// Navigation buttons: Step 4 -> 5, Step 3 -> 4
code = code.replace(
  /onClick=\{\(\) => setStep\(4\)\}/g,
  'onClick={() => setStep(step + 1)}'
);

code = code.replace(
  /onClick=\{\(\) => setStep\(3\)\}/g,
  'onClick={() => setStep(step + 1)}'
);

code = code.replace(
  /onClick=\{\(\) => setStep\(2\)\}/g,
  'onClick={() => setStep(step + 1)}'
);

// We need to update next button text conditionally
code = code.replace(
  /step === 4 \? 'Zapisz i Opublikuj' : 'Dalej'/g,
  "step === 5 ? 'Zapisz i Opublikuj' : (step === 4 ? 'Wygeneruj Portfolio' : 'Dalej')"
);

fs.writeFileSync(path, code);
