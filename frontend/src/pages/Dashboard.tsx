import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { EmptyState } from '../components/EmptyState';
import { FinancialSummary } from '../types';
import api from '../services/api';
import {
  Wallet,
  CreditCard,
  Home,
  ShoppingBag,
  PiggyBank,
  TrendingUp,
  Film,
  Target,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await api.get<FinancialSummary>('/salary-plan/summary');
      setSummary(res.data);
    } catch (e) {
      console.error('Failed to fetch summary:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64 text-[#6B5B95] text-sm">
          Loading financial data...
        </div>
      </Layout>
    );
  }

  const hasData = summary && (summary.has_data || summary.total_income > 0 || summary.total_allocated > 0);

  if (!hasData) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#2E1065]">Financial Dashboard</h1>
            <p className="text-sm text-[#6B5B95]">Real user salary allocation & health metrics</p>
          </div>
          <EmptyState />
        </div>
      </Layout>
    );
  }

  const chartData = [
    { name: 'EMI', value: summary.total_emi, color: '#E11D48' },
    { name: 'Household', value: summary.total_household, color: '#EA580C' },
    { name: 'Expenses', value: summary.total_expenses, color: '#E11D48' },
    { name: 'Savings', value: summary.total_savings, color: '#0891B2' },
    { name: 'Investments', value: summary.total_investments, color: '#D97706' },
    { name: 'Entertainment', value: summary.total_entertainment, color: '#A78BFA' },
    { name: 'Goals', value: summary.total_goal_contributions, color: '#7C3AED' },
  ].filter(item => item.value > 0);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6 text-[#2E1065]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#2E1065]">Financial Dashboard</h1>
            <p className="text-sm text-[#6B5B95]">Real-time aggregate calculations from your Firestore financial records</p>
          </div>

          <div className="flex items-center gap-3 bg-white border border-[#DDD6FE] px-4 py-2.5 rounded-xl shadow-xs">
            <div className="p-2 rounded-lg bg-[#7C3AED]/10 text-[#7C3AED]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[11px] font-semibold text-[#6B5B95] uppercase">Health Score</span>
              <span className="text-lg font-bold text-[#2E1065]">
                {summary.financial_health_score}/100 ({summary.financial_health_status})
              </span>
            </div>
          </div>
        </div>

        {/* Top Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard
            label="Monthly Income"
            amount={summary.total_income}
            icon={<Wallet className="w-5 h-5" />}
            color="income"
          />
          <StatCard
            label="Total Allocated"
            amount={summary.total_allocated}
            icon={<ShoppingBag className="w-5 h-5" />}
            color="goal"
          />
          <StatCard
            label={summary.remaining_buffer >= 0 ? "Surplus Buffer" : "Deficit Amount"}
            amount={Math.abs(summary.remaining_buffer)}
            icon={summary.remaining_buffer >= 0 ? <PiggyBank className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            color={summary.remaining_buffer >= 0 ? "income" : "expense"}
            subtext={summary.remaining_buffer >= 0 ? "Available unallocated balance" : "Planned expenses exceed monthly income!"}
          />
        </div>

        {/* Detailed Breakdown Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <StatCard label="EMI" amount={summary.total_emi} icon={<CreditCard className="w-4 h-4" />} color="expense" />
          <StatCard label="Household" amount={summary.total_household} icon={<Home className="w-4 h-4" />} color="warning" />
          <StatCard label="Expenses" amount={summary.total_expenses} icon={<ShoppingBag className="w-4 h-4" />} color="expense" />
          <StatCard label="Savings" amount={summary.total_savings} icon={<PiggyBank className="w-4 h-4" />} color="savings" />
          <StatCard label="Investments" amount={summary.total_investments} icon={<TrendingUp className="w-4 h-4" />} color="investment" />
          <StatCard label="Entertainment" amount={summary.total_entertainment} icon={<Film className="w-4 h-4" />} color="slate" />
          <StatCard label="Goal Contribution" amount={summary.total_goal_contributions} icon={<Target className="w-4 h-4" />} color="goal" />
        </div>

        {/* Salary Allocation Chart */}
        {chartData.length > 0 && (
          <Card title="Monthly Salary Distribution" subtitle="Proportional view of real user allocations">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Amount']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};
