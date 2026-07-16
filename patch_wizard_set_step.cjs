const fs = require('fs');
const path = 'src/components/Wizard.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /setStep\(3\); \/\/ Go to step 3 to let user verify generated projects\/certs\/timeline manually/g,
  'setStep(4); // Idź do kroku 4 żeby zweryfikować dane po parsowaniu'
);

// We need to change the continue button logic.
// If it is step 5, it calls handleFinishAndExplore, otherwise it should just do setStep(step + 1)
// Let's check how it handles next button.
// `onClick={() => setStep(step + 1)}` might be incorrect if it was `setStep(4)` for step 3.

fs.writeFileSync(path, code);
