## 2025-03-08 - [Missing Rate Limiter for AI API]
**Vulnerability:** The `/api/recruiter-advisor` endpoint in `server.ts` lacked rate limiting, despite acting as a proxy for the Gemini API model.
**Learning:** Endpoints that consume third-party API quotas or perform expensive operations (like AI models) must be protected with rate limiting to prevent abuse and Denial of Service (DoS) attacks.
**Prevention:** Apply the `express-rate-limit` middleware consistently to all endpoints that interface with external APIs or require significant server resources.

## 2026-07-16 - [Zombie Windows / Routing Desync]
**Vulnerability:** The application was suffering from a zombie window vulnerability due to unsynced logical states (`currentView` vs URL vs window-manager's `openApps`). It left background processes and UI elements hanging.
**Learning:** Single-Page Applications that blend URL-driven state (`popstate`) and virtual window management must implement bidirectional reconciliation (fail-safes).
**Prevention:** Introduce a global `useEffect` that continuously monitors all interdependent states (e.g. if I am in view X, then app Y MUST be open), and auto-corrects them when out of sync.
## 2026-07-17 - [Large JSON Payload Limit DoS]
**Vulnerability:** The application had a global Express JSON body parser limit of 25mb (`app.use(express.json({ limit: "25mb" }));`).
**Learning:** Setting large global limits for body parsers to satisfy a single endpoint exposes all other endpoints to Denial of Service (DoS) attacks via memory exhaustion from parsing excessively large payloads.
**Prevention:** Apply specific, large body parser limits only to the specific routes that require them, and use a small, secure default limit (e.g., 1mb or 2mb) for all other endpoints globally.
## 2025-03-08 - [XSS via dangerouslySetInnerHTML in Style Tag]
**Vulnerability:** A style tag was being rendered using \`dangerouslySetInnerHTML\` to inject a string of CSS classes directly into the DOM in \`BentoHub.tsx\`.
**Learning:** Using \`dangerouslySetInnerHTML\` is always risky. Even when the content appears to be a static string, it sets a bad precedent, fails static analysis tools (like linters), and can easily become a vector for Cross-Site Scripting (XSS) if the string is later modified to include user input or dynamic variables without proper sanitization.
**Prevention:** Avoid \`dangerouslySetInnerHTML\` for CSS. Extract static styles into dedicated CSS files and import them, or use standard React inline style objects if dynamic styling is absolutely necessary.
