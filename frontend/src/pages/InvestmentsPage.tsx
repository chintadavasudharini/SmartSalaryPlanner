import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Investment } from '../types';
import api from '../services/api';
import { Plus, Trash2, Edit3, TrendingUp } from 'lucide-react';

export const InvestmentsPage: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Investment | null>(null);

  const [investmentName, setInvestmentName] = useState('');
  const [investmentType, setInvestmentType] = useState('SIP');
  const [amountInvested, setAmountInvested] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const res = await api.get<Investment[]>('/investments');
      setInvestments(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setInvestmentName('');
    setInvestmentType('SIP');
    setAmountInvested('');
    setMonthlyContribution('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Investment) => {
    setEditingItem(item);
    setInvestmentName(item.investment_name);
    setInvestmentType(item.investment_type);
    setAmountInvested(item.amount_invested.toString());
    setMonthlyContribution(item.monthly_contribution.toString());
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      investment_name: investmentName,
      investment_type: investmentType,
      amount_invested: parseFloat(amountInvested || '0'),
      monthly_contribution: parseFloat(monthlyContribution)
    };

    try {
      if (editingItem) {
        await api.put(`/investments/${editingItem.id}`, payload);
      } else {
        await api.post('/investments', payload);
      }
      setIsModalOpen(false);
      fetchInvestments();
    } catch (err) {
      alert('Error saving investment.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this investment record?')) {
      await api.delete(`/investments/${id}`);
      fetchInvestments();
    }
  };

  const totalMonthlyInvestments = investments.reduce((acc, curr) => acc + curr.monthly_contribution, 0);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Investment Tracking</h1>
            <p className="text-sm text-slate-500">Track user SIPs, mutual funds, FDs, RD, stocks, and gold contributions</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold text-xs shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Add Investment
          </button>
        </div>

        <Card title="Investments Overview">
          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 text-white rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Total Monthly Investment Contribution</span>
                <p className="text-2xl font-bold text-slate-900">₹{totalMonthlyInvestments.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {investments.length === 0 ? (
            <p className="text-center text-slate-500 py-8 text-sm">No investment records added yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider border-b">
                  <tr>
                    <th className="py-3 px-4">Investment Name</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Total Amount Invested</th>
                    <th className="py-3 px-4">Monthly SIP / Contribution</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {investments.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-semibold text-slate-900">{item.investment_name}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                          {item.investment_type}
                        </span>
                      </td>
                      <td className="py-3 px-4">₹{item.amount_invested.toFixed(2)}</td>
                      <td className="py-3 px-4 font-bold text-indigo-700">₹{item.monthly_contribution.toFixed(2)}</td>
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
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Investment' : 'Add Investment'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Investment Name</label>
              <input
                type="text"
                required
                value={investmentName}
                onChange={(e) => setInvestmentName(e.target.value)}
                placeholder="e.g. Nifty 50 Index Mutual Fund"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
              <select
                value={investmentType}
                onChange={(e) => setInvestmentType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
              >
                <option value="SIP">SIP</option>
                <option value="Mutual Fund">Mutual Fund</option>
                <option value="FD">FD</option>
                <option value="RD">RD</option>
                <option value="Stocks">Stocks</option>
                <option value="Gold">Gold</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Accumulated Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amountInvested}
                  onChange={(e) => setAmountInvested(e.target.value)}
                  placeholder="50000"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
                />
              </div>

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
            </div>

            <button type="submit" className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold">
              Save Investment
            </button>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};
