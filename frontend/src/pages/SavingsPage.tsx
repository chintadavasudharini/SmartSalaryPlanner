import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { ProgressBar } from '../components/ProgressBar';
import { Saving } from '../types';
import api from '../services/api';
import { Plus, Trash2, Edit3, PiggyBank } from 'lucide-react';

export const SavingsPage: React.FC = () => {
  const [savings, setSavings] = useState<Saving[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Saving | null>(null);

  const [savingsGoal, setSavingsGoal] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [targetDate, setTargetDate] = useState('');

  useEffect(() => {
    fetchSavings();
  }, []);

  const fetchSavings = async () => {
    try {
      const res = await api.get<Saving[]>('/savings');
      setSavings(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setSavingsGoal('');
    setTargetAmount('');
    setCurrentAmount('');
    setMonthlyContribution('');
    setTargetDate('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Saving) => {
    setEditingItem(item);
    setSavingsGoal(item.savings_goal);
    setTargetAmount(item.target_amount.toString());
    setCurrentAmount(item.current_amount.toString());
    setMonthlyContribution(item.monthly_contribution.toString());
    setTargetDate(item.target_date);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      savings_goal: savingsGoal,
      target_amount: parseFloat(targetAmount),
      current_amount: parseFloat(currentAmount || '0'),
      monthly_contribution: parseFloat(monthlyContribution),
      target_date: targetDate
    };

    try {
      if (editingItem) {
        await api.put(`/savings/${editingItem.id}`, payload);
      } else {
        await api.post('/savings', payload);
      }
      setIsModalOpen(false);
      fetchSavings();
    } catch (err) {
      alert('Error saving savings goal.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this savings goal?')) {
      await api.delete(`/savings/${id}`);
      fetchSavings();
    }
  };

  const totalMonthlySavings = savings.reduce((acc, curr) => acc + curr.monthly_contribution, 0);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Savings Management</h1>
            <p className="text-sm text-slate-500">Track target savings, progress percentage, and required monthly contributions</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold text-xs shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Add Savings Goal
          </button>
        </div>

        <Card title="Savings Overview">
          <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-600 text-white rounded-lg">
                <PiggyBank className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Total Monthly Savings Contribution</span>
                <p className="text-2xl font-bold text-slate-900">₹{totalMonthlySavings.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {savings.length === 0 ? (
            <p className="text-center text-slate-500 py-8 text-sm">No savings goals added yet.</p>
          ) : (
            <div className="space-y-4">
              {savings.map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.savings_goal}</h4>
                      <p className="text-xs text-slate-500">Target Date: {item.target_date || 'N/A'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="block text-xs text-slate-500">Monthly Contribution</span>
                        <span className="font-bold text-sky-700 text-sm">₹{item.monthly_contribution.toFixed(2)}</span>
                      </div>
                      <div className="space-x-1">
                        <button onClick={() => handleOpenEdit(item)} className="p-1 text-slate-400 hover:text-sky-600">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-1 text-slate-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <ProgressBar progress={item.progress_percentage} label={`Accumulated: ₹${item.current_amount} / Target: ₹${item.target_amount}`} />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Modal Form */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Savings Goal' : 'Add Savings Goal'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Savings Goal Name</label>
              <input
                type="text"
                required
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(e.target.value)}
                placeholder="e.g. Emergency Fund"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
              />
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
                  placeholder="100000"
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
                  placeholder="20000"
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
                  placeholder="5000"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Date</label>
                <input
                  type="date"
                  required
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold">
              Save Savings Goal
            </button>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};
