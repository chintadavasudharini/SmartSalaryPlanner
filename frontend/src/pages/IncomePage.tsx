import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Income } from '../types';
import api from '../services/api';
import { Plus, Trash2, Edit3, Wallet } from 'lucide-react';

export const IncomePage: React.FC = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Income | null>(null);

  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [incomeType, setIncomeType] = useState('Salary');

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const res = await api.get<Income[]>('/income');
      setIncomes(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setSource('');
    setAmount('');
    setIncomeType('Salary');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Income) => {
    setEditingItem(item);
    setSource(item.source);
    setAmount(item.amount.toString());
    setIncomeType(item.income_type);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      source,
      amount: parseFloat(amount),
      income_type: incomeType
    };

    try {
      if (editingItem) {
        await api.put(`/income/${editingItem.id}`, payload);
      } else {
        await api.post('/income', payload);
      }
      setIsModalOpen(false);
      fetchIncomes();
    } catch (err) {
      alert('Error saving income record.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this income record?')) {
      await api.delete(`/income/${id}`);
      fetchIncomes();
    }
  };

  const totalMonthlyIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Income Management</h1>
            <p className="text-sm text-slate-500">Add and edit your real monthly income sources</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold text-xs shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Add Income Source
          </button>
        </div>

        <Card title="Income Overview">
          <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-600 text-white rounded-lg">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Total Monthly Income</span>
                <p className="text-2xl font-bold text-slate-900">₹{totalMonthlyIncome.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {incomes.length === 0 ? (
            <p className="text-center text-slate-500 py-8 text-sm">No income records added yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider border-b">
                  <tr>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Monthly Amount</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {incomes.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-semibold text-slate-900">{item.source}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                          {item.income_type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">₹{item.amount.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button onClick={() => handleOpenEdit(item)} className="p-1 text-slate-400 hover:text-sky-600">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-1 text-slate-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Modal Form */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Income' : 'Add Income'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Income Source Name</label>
              <input
                type="text"
                required
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. Primary Tech Salary"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Income Type</label>
              <select
                value={incomeType}
                onChange={(e) => setIncomeType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
              >
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
                <option value="Bonus">Bonus</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="60000"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
              />
            </div>

            <button type="submit" className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold">
              Save Income
            </button>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};
