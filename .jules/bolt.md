## 2025-02-18 - Avoid array recalculations on hover states
**Learning:** Found an anti-pattern in `AppProjects.tsx` where hovering over an element triggers a full component re-render, forcing a complete recalculation of an unmemoized derived array (`filteredProjects`). Array filtering includes multiple string manipulations and array operations that execute on every hover interaction needlessly.
**Action:** Always verify if complex components using `onMouseEnter`/`onMouseLeave` state updates have expensive derived state properly wrapped in `useMemo`.

## 2023-10-27 - O(N*M) Operations in Render Cycle
**Learning:** Found an anti-pattern in `BentoHub.tsx` where nested array mappings and filtering logic (O(N*M)) were run on every render due to being executed synchronously at the top level of the functional component without memoization.
**Action:** Use `useMemo` to wrap derived list states that use complex filtering, mapping, or finding operations on object arrays, especially when the arrays can be large or string manipulation is involved.
