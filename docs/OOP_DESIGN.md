# Object-Oriented Programming (OOP) Design

Smart Salary Planner demonstrates key OOP principles:

## 1. Principles Demonstrated
- **Abstraction**: `FinancialRecord` ABC encapsulates contract for `get_monthly_value()` and `to_dict()`.
- **Encapsulation**: Private/protected properties and method encapsulation for EMI compound interest calculation.
- **Inheritance**: Derived record classes (`Income`, `EMI`, `HouseholdExpense`, `Expense`, `Saving`, `Investment`, `Entertainment`, `FinancialGoal`) inherit common fields (`id`, `user_id`, `amount`, `date`).
- **Polymorphism**: Unified treatment of records via `get_monthly_value()` method overrides.

## 2. Design Patterns
- **Strategy Pattern**: `SalaryAllocationStrategy` interface with concrete implementations `GreedySalaryStrategy` and `GoalOptimizationStrategy`.
- **Repository Pattern**: `BaseRepository` interface with `FirestoreRepository` separating data access from business logic.
- **Factory Pattern**: Dynamic construction of financial record domain objects from dictionary representations.
