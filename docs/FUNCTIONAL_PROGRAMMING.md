# Functional Programming Concepts

The Python backend leverages functional programming paradigms:

## 1. Concepts Demonstrated
- **Pure Functions**: Financial math and calculations (`calculate_monthly_emi`, `calculate_health_score`, `merge_sort_records`) produce deterministic outputs without mutating global state.
- **Higher-Order Functions**: Custom decorators (`@measure_execution_time`, `@validate_positive_income`) accept and return functions.
- **Comprehensions**:
  - List comprehensions: `[float(i.get("amount", 0.0)) for i in incomes]`
  - Dict comprehensions: `{k: v for k, v in data.items()}`
  - Set comprehensions: `{str(r.get("category")) for r in records}`
- **Generators and Iterators**: Lazy stream evaluation via `financial_record_generator` and `chunked_record_iterator`.
