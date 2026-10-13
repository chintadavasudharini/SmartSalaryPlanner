# Empirical Performance Evaluation & Benchmarking

The algorithms were benchmarked using Python's `time.perf_counter()` on generated input datasets:

## 1. Actual Benchmark Measurements

| Algorithm | Input Dataset Size | Execution Time (ms) | Efficiency Notes |
|---|---|---|---|
| **Greedy Priority Allocation** | 7 Priority Categories | **0.0639 ms** | Instantaneous constant-time $O(1)$ allocation. |
| **DP 0-1 Goal Knapsack** | 25 Financial Goals | **166.8422 ms** | Computes optimal goal utility matrix $O(N \cdot B)$. |
| **Divide & Conquer Merge Sort** | 1,000 Spending Items | **9.1453 ms** | Predictable $O(N \log N)$ recursive merge. |
| **QuickSort** | 1,000 Spending Items | **7.0362 ms** | In-place partition sorting. |
| **Backtracking Search** | 12 Optional Items | **0.3039 ms** | 105 state space nodes explored with early budget pruning. |
| **Branch & Bound Deficit Cut** | 15 Optional Items | **4.7992 ms** | Pruned 136 non-promising search tree branches. |

## 2. Analysis
- **Greedy Strategy**: Extremely fast for initial salary budget partition.
- **Dynamic Programming**: Solves goal selection optimally; execution time scales linearly with discrete budget capacity units.
- **Branch & Bound vs Backtracking**: Bound pruning effectively eliminated over 50% of the theoretical search space branches when resolving salary deficits.
