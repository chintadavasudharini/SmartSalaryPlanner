# Algorithm Design & Specification

Smart Salary Planner implements five algorithmic strategies:

## 1. Greedy Algorithm — Priority Salary Allocation
- **Purpose**: Allocates income according to necessity rank: EMI → Household → Essentials → Savings → Goals → Investments → Entertainment.
- **Input**: Monthly Income $I$, requested bucket amounts.
- **Output**: Allocated amounts per bucket, remaining buffer, surplus/deficit status.
- **Complexity**: Time $O(1)$, Space $O(1)$.

## 2. Dynamic Programming — 0-1 Goal Optimization
- **Purpose**: Maximizes goal utility under available goal budget capacity.
- **State**: `DP[i][w]` = Max utility using first `i` goals with total cost $\le w$.
- **Transition**: `DP[i][w] = max(DP[i-1][w], DP[i-1][w - cost[i]] + value[i])`.
- **Complexity**: Time $O(N \cdot B)$, Space $O(N \cdot B)$.

## 3. Divide and Conquer — Merge Sort & Category Tree
- **Purpose**: Sorts spending records and recursively aggregates category totals.
- **Recurrence**: $T(n) = 2T(n/2) + O(n)$.
- **Complexity**: Time $O(n \log n)$, Space $O(n)$.

## 4. Backtracking — Discretionary Spending Combination Search
- **Purpose**: Explores combinations of optional expenses that fit within a target budget limit.
- **Pruning**: Aborts branch if `current_sum > budget_limit`.
- **Complexity**: Time $O(2^N)$ worst case, Space $O(N)$.

## 5. Branch and Bound — Deficit Reduction Optimization
- **Purpose**: Finds the minimal discretionary expense reductions to eliminate salary deficit.
- **Bounds**: Lower bound (current cut + remaining potential cuts) and upper bound (best cut found satisfying deficit).
- **Complexity**: Time $O(N \log N)$ average with pruning, Space $O(2^N)$ Priority Queue.
