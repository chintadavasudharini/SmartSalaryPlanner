import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { EMI } from '../types';
import api from '../services/api';
import { Plus, Trash2, Edit3, CreditCard, Calculator } from 'lucide-react';

export const EMIPage: React.FC = () => {
  const [emis, setEmis] = useState<EMI[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EMI | null>(null);

  const [loanName, setLoanName] = useState('');
  const [loanType, setLoanType] = useState('Personal Loan');
  const [principal, setPrincipal] = useState('');
  const [outstanding, setOutstanding] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [remainingMonths, setRemainingMonths] = useState('');

  useEffect(() => {
    fetchEMIs();
  }, []);

  const fetchEMIs = async () => {
    try {
      const res = await api.get<EMI[]>('/emi');
      setEmis(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setLoanName('');
    setLoanType('Personal Loan');
    setPrincipal('');
    setOutstanding('');
    setInterestRate('');
    setRemainingMonths('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: EMI) => {
    setEditingItem(item);
    setLoanName(item.loan_name);
    setLoanType(item.loan_type);
    setPrincipal(item.principal.toString());
    setOutstanding(item.outstanding_amount.toString());
    setInterestRate(item.annual_interest_rate.toString());
    setRemainingMonths(item.remaining_months.toString());
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      loan_name: loanName,
      loan_type: loanType,
      principal: parseFloat(principal || '0'),
      outstanding_amount: parseFloat(outstanding),
      annual_interest_rate: parseFloat(interestRate),
      remaining_months: parseInt(remainingMonths)
    };

    try {
      if (editingItem) {
        await api.put(`/emi/${editingItem.id}`, payload);
      } else {
        await api.post('/emi', payload);
      }
      setIsModalOpen(false);
      fetchEMIs();
    } catch (err) {
      alert('Error saving EMI record.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this loan/EMI record?')) {
      await api.delete(`/emi/${id}`);
      fetchEMIs();
    }
  };

  const totalMonthlyEMI = emis.reduce((acc, curr) => acc + curr.monthly_emi, 0);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">EMI & Loan Management</h1>
            <p className="text-sm text-slate-500">Deterministic compound interest calculations computed by backend</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold text-xs shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Add Loan / EMI
          </button>
        </div>

        <Card title="EMI Summary">
          <div className="p-4 bg-red-50 rounded-xl border border-red-100 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-600 text-white rounded-lg">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Total Monthly EMI Commitment</span>
                <p className="text-2xl font-bold text-slate-900">₹{totalMonthlyEMI.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {emis.length === 0 ? (
            <p className="text-center text-slate-500 py-8 text-sm">No EMI loans added yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider border-b">
                  <tr>
                    <th className="py-3 px-4">Loan Name</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Outstanding Amount</th>
                    <th className="py-3 px-4">Interest Rate</th>
                    <th className="py-3 px-4">Remaining Months</th>
                    <th className="py-3 px-4">Calculated Monthly EMI</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {emis.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-semibold text-slate-900">{item.loan_name}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                          {item.loan_type}
                        </span>
                      </td>
                      <td className="py-3 px-4">₹{item.outstanding_amount.toFixed(2)}</td>
                      <td className="py-3 px-4">{item.annual_interest_rate}% p.a.</td>
                      <td className="py-3 px-4">{item.remaining_months} mos</td>
                      <td className="py-3 px-4 font-bold text-red-600">₹{item.monthly_emi.toFixed(2)}</td>
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
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit EMI Loan' : 'Add EMI Loan'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Loan Name</label>
              <input
                type="text"
                required
                value={loanName}
                onChange={(e) => setLoanName(e.target.value)}
                placeholder="e.g. HDFC Home Loan"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Loan Type</label>
              <select
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
              >
                <option value="Home Loan">Home Loan</option>
                <option value="Personal Loan">Personal Loan</option>
                <option value="Education Loan">Education Loan</option>
                <option value="Vehicle Loan">Vehicle Loan</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Outstanding Balance (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={outstanding}
                  onChange={(e) => setOutstanding(e.target.value)}
                  placeholder="250000"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Annual Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="8.5"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Remaining Months</label>
              <input
                type="number"
                min="1"
                required
                value={remainingMonths}
                onChange={(e) => setRemainingMonths(e.target.value)}
                placeholder="36"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
              />
            </div>

            <button type="submit" className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold">
              Calculate & Save EMI
            </button>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};
