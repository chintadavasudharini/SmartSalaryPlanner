# AI-Assisted Software Engineering Practices

This document records the AI-assisted software engineering practices used during the development of Smart Salary Planner.

## 1. Specification-First Development
Prior to writing code, comprehensive problem requirements, domain models, algorithm constraints, and API schemas were formally specified:
- Problem decomposition into 11 independent modules.
- Mathematical specification of EMI calculation, Greedy allocation, 0-1 Knapsack DP, Divide & Conquer Merge Sort, Backtracking, and Branch & Bound.

## 2. Prompting Strategy & Examples
Prompts used during generation and refactoring:
- *Algorithm Generation*: "Implement 0-1 Bounded Goal Optimization Knapsack DP in Python with explicit state array initialization and backtracking to reconstruct selected items."
- *Refactoring & Deficit Reduction*: "Implement Branch and Bound using min-heap priority queue with upper bound pruning to eliminate salary deficit with minimal discretionary expense cuts."
- *Testing*: "Write property-based test invariants using Hypothesis to verify EMI calculation bounds across arbitrary non-negative principals and interest rates."

## 3. Automated & Human Validation
All AI-generated code was strictly validated via automated quality gates:
- Unit, property, integration, and E2E test suite execution (`pytest`).
- Static type checking (`mypy`).
- Code linting and formatting (`ruff`).
- Code coverage calculation (`pytest-cov`).
