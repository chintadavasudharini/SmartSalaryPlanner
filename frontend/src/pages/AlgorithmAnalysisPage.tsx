import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import api from '../services/api';
import { Cpu, Zap, GitBranch, Layers, ArrowUpDown, ShieldCheck } from 'lucide-react';

export const AlgorithmAnalysisPage: React.FC = () => {
  const [greedyRes, setGreedyRes] = useState<any>(null);
  const [dpRes, setDpRes] = useState<any>(null);
  const [dcRes, setDcRes] = useState<any>(null);
  const [backtrackRes, setBacktrackRes] = useState<any>(null);
  const [branchBoundRes, setBranchBoundRes] = useState<any>(null);
  const [benchmarkRes, setBenchmarkRes] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllAlgorithms();
  }, []);

  const fetchAllAlgorithms = async () => {
    try {
      const [g, dp, dc, bt, bb, bm] = await Promise.all([
        api.get('/algorithms/greedy'),
        api.get('/algorithms/dp-goals'),
        api.get('/algorithms/divide-conquer-sort'),
        api.get('/algorithms/backtracking'),
        api.get('/algorithms/branch-bound'),
        api.get('/algorithms/benchmark')
      ]);
      setGreedyRes(g.data);
      setDpRes(dp.data);
      setDcRes(dc.data);
      setBacktrackRes(bt.data);
      setBranchBoundRes(bb.data);
      setBenchmarkRes(bm.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
          Executing computational thinking algorithm analysis...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Algorithm Analysis & Syllabus Demonstration</h1>
          <p className="text-sm text-slate-500">
            Visibly demonstrating Greedy, Dynamic Programming, Divide & Conquer, Backtracking, Branch & Bound, and Multiprocessing benchmarks
          </p>
        </div>

        {/* 1. Greedy Algorithm */}
        <Card title="1. Greedy Algorithm — Priority Salary Allocation" subtitle="Time: O(N log N) | Space: O(1)">
          {greedyRes && (
            <div className="space-y-3 text-xs">
              <p className="text-slate-700">
                <span className="font-bold">Strategy:</span> Allocates available salary strictly by necessity priority: EMI → Household → Essentials → Savings → Goals → Investments → Entertainment.
              </p>
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div><span className="text-slate-400">Total Income:</span> <span className="font-bold text-slate-900">₹{greedyRes.income}</span></div>
                <div><span className="text-slate-400">Total Allocated:</span> <span className="font-bold text-slate-900">₹{greedyRes.total_allocated}</span></div>
                <div><span className="text-slate-400">Surplus Buffer:</span> <span className="font-bold text-emerald-600">₹{greedyRes.surplus_buffer}</span></div>
              </div>
            </div>
          )}
        </Card>

        {/* 2. Dynamic Programming */}
        <Card title="2. Dynamic Programming — 0-1 Goal Optimization Knapsack" subtitle="Time: O(N * Budget) | Space: O(N * Budget)">
          {dpRes && (
            <div className="space-y-3 text-xs">
              <p className="text-slate-700">
                <span className="font-bold">DP State & Recurrence:</span> DP[i][w] = max(DP[i-1][w], DP[i-1][w - cost[i]] + utility[i]). Maximizes total utility of funded goals under monthly budget capacity constraint.
              </p>
              <div className="bg-purple-50 p-3.5 rounded-lg border border-purple-100 flex items-center justify-between">
                <div>
                  <span className="block text-slate-500">Goal Budget Available</span>
                  <span className="font-bold text-purple-900 text-sm">₹{dpRes.available_budget}</span>
                </div>
                <div>
                  <span className="block text-slate-500">Total Goal Utility Score</span>
                  <span className="font-bold text-purple-900 text-sm">{dpRes.total_utility_score} pts</span>
                </div>
                <div>
                  <span className="block text-slate-500">Funded Goals Count</span>
                  <span className="font-bold text-purple-900 text-sm">{dpRes.funded_goals?.length || 0}</span>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* 3. Divide and Conquer */}
        <Card title="3. Divide & Conquer — Merge Sort & Recursive Category Tree" subtitle="Recurrence T(n) = 2T(n/2) + O(n) | Time: O(n log n) | Space: O(n)">
          {dcRes && (
            <div className="space-y-3 text-xs">
              <p className="text-slate-700">
                <span className="font-bold">Divide & Conquer Mechanism:</span> Recursively splits spending array into halves, sorts sub-arrays, and merges them into ranked spending order.
              </p>
              {dcRes.category_totals && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(dcRes.category_totals).map(([cat, val]: any) => (
                    <div key={cat} className="p-2.5 bg-slate-50 rounded-lg border text-center">
                      <span className="block font-semibold text-slate-700">{cat}</span>
                      <span className="font-bold text-sky-700">₹{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* 4. Backtracking */}
        <Card title="4. Backtracking — Discretionary Spending Combination Search" subtitle="Time: O(2^N) worst case (with state space pruning) | Space: O(N)">
          {backtrackRes && (
            <div className="space-y-3 text-xs">
              <p className="text-slate-700">
                <span className="font-bold">State Space Exploration:</span> Recursively explores subsets of optional items, pruning branches where current total sum exceeds budget limit.
              </p>
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 flex justify-between">
                <span>Budget Limit: ₹{backtrackRes.budget_limit}</span>
                <span>Nodes Explored: {backtrackRes.nodes_explored}</span>
                <span className="font-bold text-amber-800">Feasible Combinations Found: {backtrackRes.feasible_combinations_count}</span>
              </div>
            </div>
          )}
        </Card>

        {/* 5. Branch & Bound */}
        <Card title="5. Branch & Bound — Deficit Reduction Optimization" subtitle="Time: O(N log N) avg with bound pruning | Space: O(2^N)">
          {branchBoundRes && (
            <div className="space-y-3 text-xs">
              <p className="text-slate-700">
                <span className="font-bold">Pruning Mechanism:</span> Uses lower bound (current cut + remaining potential cuts) and upper bound (best solution satisfying deficit) to prune non-optimal branches in a Priority Queue search tree.
              </p>
              <div className="p-3 bg-red-50 rounded-lg border border-red-100 space-y-1">
                <div className="flex justify-between font-bold text-red-900">
                  <span>Required Deficit to Resolve: ₹{branchBoundRes.required_deficit}</span>
                  <span>Optimal Cut Amount: ₹{branchBoundRes.total_reduced_amount}</span>
                </div>
                <p className="text-[11px] text-red-700">
                  Nodes Explored: {branchBoundRes.nodes_explored} | Branches Pruned: {branchBoundRes.branches_pruned}
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Multiprocessing Benchmark */}
        {benchmarkRes && (
          <Card title="Multiprocessing CPU-Bound Parallel Benchmark" subtitle="Demonstrates bypassing Python GIL via ProcessPoolExecutor">
            <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-xs space-y-2">
              <p className="text-emerald-400 font-bold">Execution Mode: {benchmarkRes.benchmark_mode}</p>
              <p className="text-slate-300">
                Parallel Task Execution Complete. All CPU-bound algorithm analyses were dispatched across isolated process workers.
              </p>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};
