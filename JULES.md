# 🕵️‍♂️ Instrukcje Deweloperskie dla Julesa (i Agentów AI)

Witaj Jules! Ten plik zawiera komplet wytycznych technicznych, architektonicznych i proceduralnych dla projektu **PortfolioOS**. Przeczytaj go uważnie przed modyfikacją jakiejkolwiek linijki kodu.

---

## 💡 Wizja i Koncepcja Projektu
Aplikacja to **Smart Visual Card** — interaktywny profil-wizytówka służący jako bogate rozszerzenie tradycyjnego CV oraz profilu na LinkedIn.

### Kluczowe założenia:
1. **Domyślna prezentacja:** Wejście na domenę główną `oauthcry.com/` ładuje publiczne portfolio (domyślny slug `'adrian'`).
2. **Kreator (Wizard):** Widoczny przycisk **„Stwórz Własne Portfolio”** w każdym widoku (Header, BentoHub, Desktop, DesktopHero) prowadzi gościa do kreatora, umożliwiając mu szybkie stworzenie własnego systemu.
3. **Chmura Azure:** Dane użytkowników są bezpiecznie gromadzone i synchronizowane z chmurą **Microsoft Azure**.
4. **Weryfikacja AI (Doradca):** Rekruter może rozmawiać z wbudowanym czatem AI (`RecruiterAdvisor`), który weryfikuje kompetencje kandydata na podstawie danych z bazy.
5. **Azure Failover / Fallback (Teoria):** W przypadku wyczerpania limitów tokenów/zapytań (quota limit) w Gemini, system docelowo automatycznie przełączy się na niezależne agenty AI hostowane w chmurze Microsoft Azure (np. Azure OpenAI lub konteneryzowane agenty customowe).

---

## 🛠️ Procedura Weryfikacji (Nigdy jej nie pomijaj!)
Zanim stworzysz Pull Request (PR) lub wypchniesz kod do gałęzi `main`, **musisz** lokalnie uruchomić poniższe komendy i upewnić się, że nie zwracają one żadnych błędów. W przeciwnym razie pipeline CI/CD na GitHubie ulegnie uszkodzeniu.

```bash
# 1. Sprawdzenie kompilacji TypeScript
npm run typecheck

# 2. Sprawdzenie reguł stylu (ESLint)
npm run lint

# 3. Uruchomienie testów jednostkowych (Vitest)
npm run test
```

---

## 🎨 Wytyczne Stylu i Projektowania (Stitch, v0, Tailwind v4)
* **Design:** Stosujemy estetykę **Modern Glassmorphism** (płynne blaski, przezroczyste panele z blurem `backdrop-blur-xl`) oraz motywy retro.
* **Integracja ze Stitch:** Używaj predefiniowanych tokenów kolorystycznych z map `accentClasses` (znajdziesz je w `WindowFrame.tsx`, `DesktopHero.tsx`, `RecruiterAdvisor.tsx`).
* **Pozycjonowanie CTA:** Przycisk „Stwórz Własne Portfolio” ma zawsze status wysokiego priorytetu (animacja pulsująca, żółty/złoty akcent kolorystyczny).

---

## 🚀 Architektura API i Endpointy
* `/api/parse-cv`: Parser OCR CV/LinkedIn oparty o model Gemini.
* `/api/recruiter-advisor`: Endpoint dla weryfikatora rekrutacyjnego czatu AI. Pobiera `portfolioData` jako kontekst systemowy.

---

## 🚦 Jak zacząć pracę (Polecenie Startu):
1. Stwórz nową gałąź powiązaną z zadaniem w Linear: `git checkout -b feature/zadanie-opis`
2. Wprowadź modyfikacje kodu.
3. Wykonaj **Procedurę Weryfikacji** (patrz wyżej).
4. Jeśli wszystko jest zielone, dodaj pliki i zrób commit:
   ```bash
   git add .
   git commit -m "feat: opis zmiany"
   git push origin feature/zadanie-opis
   ```
5. Otwórz Pull Request na GitHubie.
