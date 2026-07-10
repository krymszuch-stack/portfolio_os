# Interactive components — verification and purpose

This document lists interactive pieces of the app, their purpose, verification checklist and accessibility/personalization notes.

- Dock
  - Purpose: Launch/minimize/open apps; quick access to key features.
  - Verify: click launches app, double-click behavior, drag ordering, keyboard focus (tab), tooltip on hover, accessible name for screen readers.
  - Accessibility: ensure buttons have aria-labels and visible focus ring.
  - Personalization: allow adding/removing icons, resizing in settings.

- Desktop Icons
  - Purpose: Open apps, show context menu, drag & drop to reorder.
  - Verify: double-click to open, right-click context menu, drag works, keyboard open (Enter), long-press on touch.
  - Accessibility: set role="button" and aria-label; support keyboard move via modifiers.

- WindowFrame (app windows)
  - Purpose: Contain app content, support minimize/maximize/close/drag/focus.
  - Verify: open/close/minimize restore, z-index ordering, focus trap inside modal windows, animation smoothness, resize performance.
  - Accessibility: title in aria-labelledby, close button labelled, keyboard shortcuts operate (Esc close, Alt+Tab style navigation optional).

- SpotlightSearch
  - Purpose: Global quick-launch (Ctrl/Cmd+K)
  - Verify: opens on shortcut, keyboard navigation of results, enter launches, escape closes, no focus loss.
  - Accessibility: ensure input has aria-autocomplete and results have role="listbox"/"option".

- ParticleOverlay (sparks / ambient particles)
  - Purpose: Decorative feedback (sparks on clicks) and ambient motion.
  - Verify: respects prefers-reduced-motion, spawns on clicks, performance under low-end devices, no layout jank.
  - Accessibility: toggle in Appearance settings; pause/remove for screen readers.

- Wizard / Generator
  - Purpose: Onboarding & portfolio generation UI.
  - Verify: step navigation, saving, cancel, progress persistence, graceful failure handling.
  - Accessibility: step headings, progress expressed to assistive tech, focus moves to first interactive element on step change.

- AuthScreen / Login flow
  - Purpose: Sign-in / guest mode entry.
  - Verify: MSAL init path (success and failure), guest flow, revert to login, error messages.
  - Accessibility: form labels, error alerts with role="alert".

- PortfolioView (projects, certificates)
  - Purpose: Display project tiles and project deep-links.
  - Verify: images lazy-load, click navigates, external links open with rel="noopener noreferrer", keyboard navigation of tiles.
  - Accessibility: alt text for images, tile roles and focus management.

- ContactForm
  - Purpose: Send messages / integrations.
  - Verify: validation messages, success/failure UX, rate-limiting behavior, accessible error descriptions.

- Sync / Save to Cloud
  - Purpose: Persist user config to Firestore.
  - Verify: status changes (saving, synced, error), offline fallback, retry path, debounce behavior.
  - Accessibility: status announced when saving completes (aria-live).

- Sounds & Haptics toggles
  - Purpose: toggle audio and haptics feedback.
  - Verify: toggles persist, play on expected events, mute respects user choice.
  - Accessibility: provide visual equivalents and disable non-essential animations when user prefers reduced motion.

Checklist for verification run (QA):
- Run with prefers-reduced-motion and ensure animations are minimized.
- Test on mobile/responsive widths and ensure touch interactions work.
- Use keyboard-only navigation to open/close apps, open Spotlight, and interact with wizard.
- Run performance profiling (DevTools) and verify < 100ms main-thread frames during idle and < 16ms during animation when possible.

Personalization notes:
- Expose particle intensity, motion reduction, sound volume, font scaling, and color themes in Appearance settings.
- Provide "Accessibility" quick-toggle for reduced motion and high-contrast mode.

