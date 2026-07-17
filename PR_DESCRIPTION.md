Title: 🔒 Fix large JSON payload limit vulnerability

🎯 **What:** Reduced the global JSON payload limit from 25mb to 2mb, while preserving the 25mb limit specifically for the OCR endpoint (`/api/parse-cv`).
⚠️ **Risk:** A global 25mb limit exposes all API endpoints to potential Denial of Service (DoS) attacks via excessively large payloads (memory exhaustion/CPU lockup).
🛡️ **Solution:** Applied route-specific `express.json` middleware for `/api/parse-cv` with a 25mb limit and established a strict global fallback of 2mb.
