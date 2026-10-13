# Testing Strategy & Quality Assurance

Smart Salary Planner incorporates a multi-tier testing strategy:

## 1. Test Levels & Tools
- **Unit Tests (`pytest`)**: Verifies deterministic EMI compound math, Greedy priority allocation, DP goal optimization, Divide & Conquer merge sort, Backtracking combination search, and Branch & Bound deficit reduction (`backend/tests/unit/`).
- **Property-Based Testing (`Hypothesis`)**: Verifies invariants over generated input spaces (`backend/tests/property/test_properties.py`):
  - Allocation totals and balance non-negativity.
  - EMI compound calculation non-negativity across all principal, rate, and month combinations.
  - Sorting preservation of list length and monotonic ordering.
- **Integration Tests**: REST API endpoints tested via FastAPI `TestClient` (`backend/tests/integration/test_api.py`).
- **End-to-End (E2E) Workflow Test**: Simulates complete realistic user journey without demo data (`backend/tests/e2e/test_e2e_workflow.py`).

## 2. Executing Tests & Coverage
```bash
python -m pytest backend/tests --cov=backend/app --cov-report=term-missing
```
Target: $\ge 80\%$ test coverage on core algorithm and business logic modules.
