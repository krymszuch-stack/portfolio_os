## 2025-03-08 - [Missing Rate Limiter for AI API]
**Vulnerability:** The `/api/recruiter-advisor` endpoint in `server.ts` lacked rate limiting, despite acting as a proxy for the Gemini API model.
**Learning:** Endpoints that consume third-party API quotas or perform expensive operations (like AI models) must be protected with rate limiting to prevent abuse and Denial of Service (DoS) attacks.
**Prevention:** Apply the `express-rate-limit` middleware consistently to all endpoints that interface with external APIs or require significant server resources.

## 2026-07-16 - [Zombie Windows / Routing Desync]
**Vulnerability:** The application was suffering from a zombie window vulnerability due to unsynced logical states (`currentView` vs URL vs window-manager's `openApps`). It left background processes and UI elements hanging.
**Learning:** Single-Page Applications that blend URL-driven state (`popstate`) and virtual window management must implement bidirectional reconciliation (fail-safes).
**Prevention:** Introduce a global `useEffect` that continuously monitors all interdependent states (e.g. if I am in view X, then app Y MUST be open), and auto-corrects them when out of sync.
