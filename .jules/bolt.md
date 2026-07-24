## 2024-06-25 - Promise.all Optimization for API calls

**Learning:** When executing multiple independent API calls in a loop (like syncing multiple projects), a sequential `for` loop significantly increases latency.
**Action:** Use `Promise.all(array.map(async (item) => {...}))` to handle API calls concurrently, which drastically improves performance (e.g., ~10x speedup).
