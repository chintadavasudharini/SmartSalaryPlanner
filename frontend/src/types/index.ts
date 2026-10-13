export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface Income {
  id: string;
  user_id: string;
  source: string;
  amount: number;
  date?: string;
  income_type: string;
}

export interface EMI {
  id: string;
  user_id: string;
  loan_name: string;
  loan_type: string;
  principal: number;
  outstanding_amount: number;
  annual_interest_rate: number;
  monthly_emi: number;
  remaining_months: number;
  total_payment: number;
  total_interest: number;
  date?: string;
}

export interface HouseholdExpense {
  id: string;
  user_id: string;
  item_name: string;
  category: string;
  amount: number;
  date?: string;
}

export interface Expense {
  id: string;
  user_id: string;
  expense_name: string;
  category: string;
  amount: number;
  date?: string;
}

export interface Saving {
  id: string;
  user_id: string;
  savings_goal: string;
  target_amount: number;
  current_amount: number;
  monthly_contribution: number;
  target_date: string;
  remaining_amount: number;
  progress_percentage: number;
}

export interface Investment {
  id: string;
  user_id: string;
  investment_name: string;
  investment_type: string;
  amount_invested: number;
  monthly_contribution: number;
  start_date?: string;
}

export interface Entertainment {
  id: string;
  user_id: string;
  name: string;
  category: string;
  amount: number;
  date?: string;
}

export interface Goal {
  id: string;
  user_id: string;
  goal_name: string;
  goal_type: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  monthly_contribution: number;
  priority: number;
  remaining_amount: number;
  progress_percentage: number;
  remaining_months: number;
  required_monthly_contribution: number;
  is_sufficient: boolean;
}

export interface FinancialSummary {
  total_income: number;
  total_emi: number;
  total_household: number;
  total_expenses: number;
  total_savings: number;
  total_investments: number;
  total_entertainment: number;
  total_goal_contributions: number;
  total_allocated: number;
  remaining_buffer: number;
  financial_health_score: number;
  financial_health_status: string;
  has_data?: boolean;
}

export interface GreedyAllocationItem {
  label: string;
  requested: number;
  allocated: number;
  percentage: number;
  status: string;
}

export interface GreedyAnalysisResult {
  algorithm: string;
  income: number;
  total_allocated: number;
  surplus_buffer: number;
  total_deficit: number;
  is_feasible: boolean;
  allocations: Record<string, GreedyAllocationItem>;
}
