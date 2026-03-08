# Technical Report: Sprint 2 Algorithm Updates

**Date:** March 8, 2026  
**Author:** Engineering Team  
**Status:** In Progress

---

## 1. Executive Summary

During Sprint 2, the primary goal was to stabilize the SMILES parsing engine and optimize the hash bitwise operations inside the Tanimoto indexer. Memory-bound errors have been significantly reduced.

### Current Metrics
- **Throughput:** 12,000 SMILES/second (up from 3,500)
- **Error Rate:** 0.04% processing failure
- **Fingerprint Dim:** 2048-bit (MACCS adjusted)

## 2. Optimizations Tested

We conducted three distinct A/B tests on the bitwise logic using `RDKit` primitives:

1. **Test A:** Raw explicit bitvectors
2. **Test B:** Sparse bitvectors
3. **Test C:** Compressed numpy arrays

> **Result:** Test C (compressed numpy arrays) yielded the fastest Tanimoto similarity calculation primarily due to CPU cache alignment and vectorized `popcount` operations.

## 3. Code Modifications

Here is an example of the optimized Python snippet now in the `core` engine:

```python
import numpy as np

def optimized_tanimoto(fp1: np.ndarray, fp2: np.ndarray) -> float:
    # Vectorized bitwise AND and OR for fast popcounts
    intersect = np.bitwise_and(fp1, fp2)
    union = np.bitwise_or(fp1, fp2)
    
    # Calculate sizes
    intersect_count = np.unpackbits(intersect).sum()
    union_count = np.unpackbits(union).sum()
    
    if union_count == 0:
        return 0.0
        
    return float(intersect_count) / float(union_count)
```

## 4. Next Steps for Sprint 3

- Wrap the numpy arrays into the Pydantic API layer.
- Ensure the Docker image properly compiles with optimized C extensions (Cython/Numba) enabled for the popcount.
- Validate on the 1M compound validation set.
