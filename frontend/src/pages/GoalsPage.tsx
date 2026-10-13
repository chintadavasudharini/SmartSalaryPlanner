import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { ProgressBar } from '../components/ProgressBar';
import { Goal } from '../types';
import api from '../services/api';
import { Plus, Trash2, Edit3, Target, CheckCircle2, AlertTriangle } from 'lucide-react';

export const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Goal | null>(null);

  const [goalName, setGoalName] = useState('');
  const [goalType, setGoalType] = useState('Emergency Fund');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [priority, setPriority] = useState('1');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await api.get<Goal[]>('/goals');
      setGoals(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setGoalName('');
    setGoalType('Emergency Fund');
    setTargetAmount('');
    setCurrentAmount('');
    setDeadline('');
    setMonthlyContribution('');
    setPriority('1');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Goal) => {
    setEditingItem(item);
    setGoalName(item.goal_name);
    setGoalType(item.goal_type);
    setTargetAmount(item.target_amount.toString());
    setCurrentAmount(item.current_amount.toString());
    setDeadline(item.deadline);
    setMonthlyContribution(item.monthly_contribution.toString());
    setPriority(item.priority.toString());
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      goal_name: goalName,
      goal_type: goalType,
      target_amount: parseFloat(targetAmount),
      current_amount: parseFloat(currentAmount || '0'),
      deadline,
      monthly_contribution: parseFloat(monthlyContribution),
      priority: parseInt(priority)
    };

    try {
      if (editingItem) {
        await api.put(`/goals/${editingItem.id}`, payload);
      } else {
        await api.post('/goals', payload);
      }
      setIsModalOpen(false);
      fetchGoals();
    } catch (err) {
      alert('Error saving goal.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this goal?')) {
      await api.delete(`/goals/${id}`);
      fetchGoals();
    }
  };

  const totalGoalContributions = goals.reduce((acc, curr) => acc + curr.monthly_contribution, 0);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Financial Goals</h1>
            <p className="text-sm text-slate-500">Define financial goals, calculate sufficiency, and track deadline progress</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-xs shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Create Goal
          </button>
        </div>

        <Card title="Financial Goals Summary">
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-600 text-white rounded-lg">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Total Monthly Goal Contribution</span>
                <p className="text-2xl font-bold text-slate-900">₹{totalGoalContributions.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {goals.length === 0 ? (
            <p className="text-center text-slate-500 py-8 text-sm">No financial goals created yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map((item) => (
                <div key={item.id} className="p-5 rounded-xl border border-slate-200 bg-white hover:border-purple-300 transition space-y-4 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-base">{item.goal_name}</h4>
                        <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[10px] font-bold">
                          P{item.priority}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{item.goal_type} • Deadline: {item.deadline}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => handleOpenEdit(item)} className="p-1 text-slate-400 hover:text-sky-600">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1 text-slate-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <ProgressBar progress={item.progress_percentage} color="bg-purple-600" label={`Progress: ₹${item.current_amount} / ₹${item.target_amount}`} />

                  <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="block text-slate-400 text-[10px]">Monthly Contribution</span>
                      <span className="font-bold text-slate-800">₹{item.monthly_contribution.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[10px]">Required / mo</span>
                      <span className="font-bold text-slate-800">₹{item.required_monthly_contribution.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    {item.is_sufficient ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Contribution Sufficient for Deadline
                      </span>
                    ) : (
                      <span className="text-amber-600 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" /> Increase by ₹{(item.required_monthly_contribution - item.monthly_contribution).toFixed(2)} to meet deadline
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Modal Form */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Goal' : 'Create Financial Goal'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Goal Name</label>
              <input
                type="text"
                required
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                placeholder="e.g. New M3 MacBook Pro"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Goal Type</label>
                <select
                  value={goalType}
                  onChange={(e) => setGoalType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
                >
                  <option value="Emergency Fund">Emergency Fund</option>
                  <option value="Education">Education</option>
                  <option value="Travel">Travel</option>
                  <option value="Car">Car</option>
                  <option value="Home">Home</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Priority (1 = Highest)</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
                >
                  <option value="1">Priority 1 (Highest)</option>
                  <option value="2">Priority 2</option>
                  <option value="3">Priority 3</option>
                  <option value="4">Priority 4</option>
                  <option value="5">Priority 5 (Lowest)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="200000"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Current Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  placeholder="30000"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Contribution (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  placeholder="8000"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Deadline</label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold">
              Save Goal
            </button>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};
