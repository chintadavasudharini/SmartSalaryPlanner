import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { HouseholdExpense } from '../types';
import api from '../services/api';
import { Plus, Trash2, Edit3, Home } from 'lucide-react';

export const HouseholdPage: React.FC = () => {
  const [household, setHousehold] = useState<HouseholdExpense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HouseholdExpense | null>(null);

  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    fetchHousehold();
  }, []);

  const fetchHousehold = async () => {
    try {
      const res = await api.get<HouseholdExpense[]>('/household');
      setHousehold(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setItemName('');
    setCategory('Groceries');
    setAmount('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: HouseholdExpense) => {
    setEditingItem(item);
    setItemName(item.item_name);
    setCategory(item.category);
    setAmount(item.amount.toString());
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      item_name: itemName,
      category,
      amount: parseFloat(amount)
    };

    try {
      if (editingItem) {
        await api.put(`/household/${editingItem.id}`, payload);
      } else {
        await api.post('/household', payload);
      }
      setIsModalOpen(false);
      fetchHousehold();
    } catch (err) {
      alert('Error saving household expense.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this household expense item?')) {
      await api.delete(`/household/${id}`);
      fetchHousehold();
    }
  };

  const totalHouseholdCost = household.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Household Expenses</h1>
            <p className="text-sm text-slate-500">Track essential living, rent, groceries, and utility costs</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold text-xs shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Add Household Expense
          </button>
        </div>

        <Card title="Household Summary">
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-600 text-white rounded-lg">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Total Household Expenditure</span>
                <p className="text-2xl font-bold text-slate-900">₹{totalHouseholdCost.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {household.length === 0 ? (
            <p className="text-center text-slate-500 py-8 text-sm">No household expenses added yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider border-b">
                  <tr>
                    <th className="py-3 px-4">Item / Description</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Monthly Amount</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {household.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-semibold text-slate-900">{item.item_name}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                          {item.category}
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
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Household Expense' : 'Add Household Expense'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Item / Service Name</label>
              <input
                type="text"
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Monthly Grocery Bill"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
              >
                <option value="Rent">Rent</option>
                <option value="Electricity">Electricity</option>
                <option value="Water">Water</option>
                <option value="Gas">Gas</option>
                <option value="Groceries">Groceries</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Milk">Milk</option>
                <option value="Internet">Internet</option>
                <option value="Mobile">Mobile</option>
                <option value="Household Items">Household Items</option>
                <option value="Domestic Help">Domestic Help</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Cost (₹)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="8000"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
              />
            </div>

            <button type="submit" className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold">
              Save Household Expense
            </button>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};
