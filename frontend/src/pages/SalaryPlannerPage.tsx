import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { FinancialSummary, GreedyAnalysisResult } from '../types';
import api from '../services/api';
import { Calculator, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SalaryPlannerPage: React.FC = () => {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [greedyPlan, setGreedyPlan] = useState<GreedyAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlannerData();
  }, []);

  const fetchPlannerData = async () => {
    try {
      const [sumRes, greedyRes] = await Promise.all([
        api.get<FinancialSummary>('/salary-plan/summary'),
        api.get<GreedyAnalysisResult>('/algorithms/greedy')
      ]);
      setSummary(sumRes.data);
      setGreedyPlan(greedyRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !summary) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
          Calculating salary allocation plan...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Salary Planner</h1>
            <p className="text-sm text-slate-500">Main Algorithmic Allocation Module & Salary Balance Calculator</p>
          </div>

          <button
            onClick={() => navigate('/algorithm-analysis')}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            Explore Algorithm Analysis <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Formula Display */}
        <Card title="Salary Balance Formula Execution">
          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3 font-mono text-xs">
            <p className="text-sky-400 font-semibold">
              total_allocated = EMI ({summary.total_emi}) + Household ({summary.total_household}) + Expenses ({summary.total_expenses}) + Savings ({summary.total_savings}) + Investments ({summary.total_investments}) + Entertainment ({summary.total_entertainment}) + Goals ({summary.total_goal_contributions}) = ₹{summary.total_allocated.toFixed(2)}
            </p>
            <p className="text-slate-300">
              remaining_buffer = Income ({summary.total_income}) - total_allocated ({summary.total_allocated}) = <span className={summary.remaining_buffer >= 0 ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>₹{summary.remaining_buffer.toFixed(2)}</span>
            </p>
          </div>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard label="Monthly Income" amount={summary.total_income} color="income" />
          <StatCard label="Total Planned Allocations" amount={summary.total_allocated} color="goal" />
          <StatCard
            label={summary.remaining_buffer >= 0 ? "Surplus Buffer" : "Salary Deficit"}
            amount={Math.abs(summary.remaining_buffer)}
            color={summary.remaining_buffer >= 0 ? "income" : "expense"}
          />
        </div>

        {/* Status Alert */}
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-medium ${
          summary.remaining_buffer >= 0
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {summary.remaining_buffer >= 0 ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold block text-sm">Balanced Salary Plan (Surplus: ₹{summary.remaining_buffer.toFixed(2)})</span>
                Your planned commitments fit within your monthly income. You can allocate your surplus to savings or investments.
              </div>
            </>
          ) : (
            <>
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <span className="font-bold block text-sm">Deficit Alert (Deficit: ₹{Math.abs(summary.remaining_buffer).toFixed(2)})</span>
                Your planned allocations exceed your monthly salary. Use the Branch and Bound reduction algorithm or AI Salary Manager to optimize discretionary spending.
              </div>
            </>
          )}
        </div>

        {/* Priority Breakdown Table */}
        {greedyPlan && greedyPlan.allocations && (
          <Card title="Greedy Priority Allocation Breakdown" subtitle="Prioritized allocation according to necessity ranking">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold uppercase border-b">
                  <tr>
                    <th className="py-3 px-4">Priority Bucket</th>
                    <th className="py-3 px-4">Requested</th>
                    <th className="py-3 px-4">Allocated</th>
                    <th className="py-3 px-4">% of Salary</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Object.entries(greedyPlan.allocations).map(([key, val]) => (
                    <tr key={key} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-semibold text-slate-900">{val.label}</td>
                      <td className="py-3 px-4">₹{val.requested.toFixed(2)}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">₹{val.allocated.toFixed(2)}</td>
                      <td className="py-3 px-4">{val.percentage}%</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          val.status === 'FULLY_FUNDED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : val.status === 'PARTIALLY_FUNDED'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {val.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};
