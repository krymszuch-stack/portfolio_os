const fs = require('fs');
const path = 'server.ts';
let code = fs.readFileSync(path, 'utf8');

// Replace the prompt with updated one
code = code.replace(
  /"bio": \{/g,
  `"bio": {
            "suggestedCategory": "ID jednej z kategorii (tech, craft, agriculture, gardening, creative, business, general)",
            "suggestedProfessionId": "ID sugerowanego zawodu z dostępnego słownika",`
);

// Add context of industryCategories to the instruction
const replacement = `
        Zasady kompilacji i OCR:
        1. Jeśli przekazano plik (fileData), dokonaj najpierw dokładnego OCR tekstu i zidentyfikuj wszystkie sekcje.
        2. Przeanalizuj każde słowo, przetłumacz sekcje na elegancki i profesjonalny język polski.
        3. Każdy element (umiejętność, technologia, rola) musi być szczegółowo opisany oraz zawierać powiązaną tablicę synonimów (synonyms), które pozwolą później na łączenie zmiennych (np. "React" ma synonimy ["ReactJS", "React.js", "Frontend", "JSX", "JavaScript UI"]).
        4. Oceny zawodu: na podstawie analizy CV wybierz NAJBARDZIEJ PASUJĄCĄ KATEGORIĘ ORAZ ID ZAWODU.
           Dostępne kategorie: "tech", "craft", "agriculture", "gardening", "creative", "business", "general".
           Przykładowe zawody (użyj ID np. 'web-developer', 'ai-engineer', 'graphic-designer', 'accountant', 'mechanic', 'electrician' itd.). Jeśli żaden z popularnych nie pasuje, możesz użyć 'other'. Oczekiwany jest ścisły string id w polu \`suggestedProfessionId\`.
`;

code = code.replace(/Zasady kompilacji i OCR:[\s\S]*?3\..*?\)/, replacement);

fs.writeFileSync(path, code);
