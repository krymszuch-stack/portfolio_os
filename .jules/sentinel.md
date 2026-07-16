## 2025-03-08 - [Missing Rate Limiter for AI API]
**Vulnerability:** The `/api/recruiter-advisor` endpoint in `server.ts` lacked rate limiting, despite acting as a proxy for the Gemini API model.
**Learning:** Endpoints that consume third-party API quotas or perform expensive operations (like AI models) must be protected with rate limiting to prevent abuse and Denial of Service (DoS) attacks.
**Prevention:** Apply the `express-rate-limit` middleware consistently to all endpoints that interface with external APIs or require significant server resources.
