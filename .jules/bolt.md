## 2025-02-18 - Avoid array recalculations on hover states
**Learning:** Found an anti-pattern in `AppProjects.tsx` where hovering over an element triggers a full component re-render, forcing a complete recalculation of an unmemoized derived array (`filteredProjects`). Array filtering includes multiple string manipulations and array operations that execute on every hover interaction needlessly.
**Action:** Always verify if complex components using `onMouseEnter`/`onMouseLeave` state updates have expensive derived state properly wrapped in `useMemo`.
