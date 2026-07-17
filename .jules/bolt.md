## 2026-07-17 - Pre-compute static normalizations
 **Learning:** Repeated text normalization (`normalizeText`) with heavy regex and `.replace()` operations inside nested loops for static dictionary arrays scales poorly.
 **Action:** Compute normalized texts once at module initialization or first use rather than inside the search loops.
