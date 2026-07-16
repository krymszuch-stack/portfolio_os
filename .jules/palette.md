## 2026-07-16 - Replaced spans with proper labels in ContactForm
**Learning:** The contact form used `<span>` elements styled to look like labels, which limits accessibility for screen readers and reduces the clickable area. Adding `<label htmlFor>` improves both.
**Action:** When encountering pseudo-labels, convert them to proper `<label>`s and tie them to their inputs via `htmlFor` and `id` while maintaining their CSS layout properties (e.g., using `block`).
