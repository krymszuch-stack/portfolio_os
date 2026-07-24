🛡️ Sentinel: [medium/low] Trust proxy for rate limiting

🎯 **What:** Configured Express to trust the reverse proxy.
⚠️ **Risk:** When deployed behind a reverse proxy, the `express-rate-limit` middleware uses the proxy's IP address instead of the actual client's IP. This could result in either all users being rate-limited together (DoS) or attackers bypassing the limit by spoofing IPs.
🛡️ **Solution:** Added `app.set('trust proxy', 1)` during Express app initialization in `server.ts` to ensure the `req.ip` correctly reflects the client's IP via the `X-Forwarded-For` header.

✅ **Verification:**
- Ran `pnpm lint` to ensure no linting errors were introduced.
- Ran `pnpm test` to verify no functionality was broken.
