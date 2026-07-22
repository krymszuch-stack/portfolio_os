## 2025-02-18 - Avoid array recalculations on hover states
**Learning:** Found an anti-pattern in `AppProjects.tsx` where hovering over an element triggers a full component re-render, forcing a complete recalculation of an unmemoized derived array (`filteredProjects`). Array filtering includes multiple string manipulations and array operations that execute on every hover interaction needlessly.
**Action:** Always verify if complex components using `onMouseEnter`/`onMouseLeave` state updates have expensive derived state properly wrapped in `useMemo`.

## 2025-02-18 - Memoize filtered arrays to avoid re-calculating on every hover
**Learning:** Found a performance bottleneck where hovering over items in the `SpotlightSearch.tsx` triggered full component re-renders and re-filtered a static array (`availableApps`) due to `onMouseEnter` triggering a state update. The array filtering operation ran on every hover action because the array mapping function and string manipulators inside it were not memoized.
**Action:** Used `useMemo` for `filteredApps` to limit array filtering recalculation strictly to when `searchQuery` changes, keeping the hover logic quick. Always use `useMemo` for derived states, especially those iterating arrays, inside components reacting to frequent pointer events.
