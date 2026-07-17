## 2024-05-30 - Optimize string normalization in classification

**Learning:** When performing text matching against a large dictionary in a tight loop or across multiple function calls (like finding the best profession and then getting top matches), normalizing dictionary terms on the fly is highly inefficient due to repeated regex and string operations on the same static strings.
**Action:** Pre-compute and cache the normalized strings of any static dictionary once at module load time. Map the static dictionary to a parallel structure containing the normalized arrays, then iterate over the pre-computed arrays instead.
