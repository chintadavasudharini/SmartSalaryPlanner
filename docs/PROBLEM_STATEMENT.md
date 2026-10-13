# Smart Salary Planner — Problem Statement

## 1. Real-World Problem
Salaried individuals often receive a fixed monthly income but face significant challenges in dividing it effectively between competing financial demands:
- Monthly income sources (Salary, Freelance, Bonuses)
- Fixed debt commitments (EMIs: Home, Personal, Vehicle loans, Credit Cards)
- Essential household living costs (Rent, Electricity, Water, Groceries, Domestic help)
- General non-essential expenses (Shopping, Transport, Medical, Travel)
- Savings target allocations
- Long-term investment contributions (SIPs, Mutual Funds, Stocks, FDs)
- Discretionary entertainment spending (OTT subscriptions, Dining, Movies)
- Priority financial goals (Emergency fund, Education, Home down payment)

Without structured financial planning algorithms, users frequently suffer from overspending, loan defaults, goal shortfalls, and salary deficits.

## 2. Computational Problem Formulation
The problem is modeled as a multi-stage constrained optimization and search problem:

$$\text{Inputs: } \mathcal{I} = \{\text{Income}, \text{EMI}, \text{Household}, \text{Expenses}, \text{Savings}, \text{Investments}, \text{Entertainment}, \text{Goals}\}$$

$$\text{Total Allocated } A = \sum_{k \in \mathcal{I}} \text{Allocation}_k$$

$$\text{Remaining Buffer } B = \text{Income} - A$$

- **Constraints**: $A \le \text{Income}$ (for surplus $B \ge 0$).
- **Goal Optimization**: Maximize total utility of goal allocations under budget constraint $B$.
- **Deficit Reduction**: Minimize discretionary expense cuts to eliminate deficit $B < 0$.

## 3. Disclaimers
The application is a computational decision-support tool. It is **NOT** a regulated financial advisory service and does **NOT** guarantee investment returns.
