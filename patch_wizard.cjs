const fs = require('fs');
const path = 'src/components/Wizard.tsx';
let code = fs.readFileSync(path, 'utf8');

// Patch 1: Read suggested fields from parse result
const searchResultBio = "if (result.bio) {";
const replaceResultBio = `if (result.bio) {
        if (result.bio.suggestedCategory) {
          const foundCat = industryCategories.find(c => c.id === result.bio.suggestedCategory);
          if (foundCat) setSelectedCategory(foundCat);
        }
        if (result.bio.suggestedProfessionId) {
          setManualProfessionId(result.bio.suggestedProfessionId);
        }`;
code = code.replace(searchResultBio, replaceResultBio);

// Patch 2: Avatar URL input
const searchAvatarInput = `<span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Wybierz avatar profilowy</span>`;
const replaceAvatarInput = `<span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Wybierz avatar lub podaj URL</span>
                  <input
                    type="text"
                    placeholder="Wklej link do zdjęcia (np. z LinkedIn)"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 outline-none mb-3"
                  />`;
code = code.replace(searchAvatarInput, replaceAvatarInput);

// Patch 3: Step 3.5 Intermediate Verification state
// Add a "Weryfikacja" Step text
code = code.replace(
  /setParseStatus\('Gotowe!'\);\s*\/\/\s*Jump directly to Step 4[\s\S]*?setStep\(4\);/,
  `setParseStatus('Gotowe!');
      // Move to intermediate verification step instead of jumping straight to publish
      setStep(3); // Go to step 3 to let user verify generated projects/certs/timeline manually`
);

// We need to modify the 4 steps to handle verification correctly.
// Step 3 is typically "Dodatkowe sekcje". We can ensure that when in AI mode, Step 3 displays the generated content and asks for confirmation.

fs.writeFileSync(path, code);
