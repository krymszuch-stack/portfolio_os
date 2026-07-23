## 2024-03-24 - Missing ARIA Labels on Icon-Only Buttons
**Learning:** Found a pattern of missing `aria-label` attributes on icon-only buttons, specifically for destructive actions like delete (`X` icons) and edit (`Edit2` icons). Without `aria-label`s, screen readers read out the element type ("button") without providing context on its function, which severely impacts accessibility for visually impaired users.
**Action:** Always include descriptive `aria-label`s on buttons that contain only icons, especially for critical actions like removing tags or deleting items. Added `aria-label` to delete and edit buttons in `IconTile` and tag removal in `Wizard`.
## 2024-03-24 - Missing ARIA Labels on Icon-Only Link Elements (Social Dock)
**Learning:** Found a pattern of missing `aria-label` attributes on `<a>` tags functioning as buttons/icons in `BentoHub.tsx` (the social dock). While they had `title` attributes (e.g., `title="GitHub"`), screen readers often prefer explicit `aria-label`s for interactive elements that lack text content.
**Action:** Always ensure that icon-only `<a>` tags, just like `<button>` tags, include a descriptive `aria-label`.
