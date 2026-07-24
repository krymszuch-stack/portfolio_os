## 2025-02-18 - Avoid array recalculations on hover states
**Learning:** Found an anti-pattern in `AppProjects.tsx` where hovering over an element triggers a full component re-render, forcing a complete recalculation of an unmemoized derived array (`filteredProjects`). Array filtering includes multiple string manipulations and array operations that execute on every hover interaction needlessly.
**Action:** Always verify if complex components using `onMouseEnter`/`onMouseLeave` state updates have expensive derived state properly wrapped in `useMemo`.
## 2024-05-19 - Concurrent GitHub API Sync in Loop

**Learning:** Replaced a sequential `for` loop executing `await fetch` with a concurrent `Promise.all(updatedProjects.map(async (p) => { ... }))`. This allows multiple network requests to be processed in parallel instead of waiting for each one to finish sequentially, resulting in a dramatic reduction in total execution time when fetching data for multiple GitHub projects.

**Action:** In operations involving multiple independent asynchronous tasks (especially network I/O), prefer `Promise.all` over sequential iteration to maximize throughput and minimize overall latency.
