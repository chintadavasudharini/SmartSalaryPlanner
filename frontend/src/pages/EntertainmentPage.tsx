import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Entertainment } from '../types';
import api from '../services/api';
import { Plus, Trash2, Edit3, Film } from 'lucide-react';

export const EntertainmentPage: React.FC = () => {
  const [items, setItems] = useState<Entertainment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Entertainment | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Subscriptions');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    fetchEntertainment();
  }, []);

  const fetchEntertainment = async () => {
    try {
      const res = await api.get<Entertainment[]>('/entertainment');
      setItems(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName('');
    setCategory('Subscriptions');
    setAmount('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Entertainment) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setAmount(item.amount.toString());
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      category,
      amount: parseFloat(amount)
    };

    try {
      if (editingItem) {
        await api.put(`/entertainment/${editingItem.id}`, payload);
      } else {
        await api.post('/entertainment', payload);
      }
      setIsModalOpen(false);
      fetchEntertainment();
    } catch (err) {
      alert('Error saving entertainment expense.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this discretionary item?')) {
      await api.delete(`/entertainment/${id}`);
      fetchEntertainment();
    }
  };

  const totalEntertainmentAmount = items.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Entertainment & Discretionary Spending</h1>
            <p className="text-sm text-slate-500">Track OTT subscriptions, movies, restaurants, and hobbies</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold text-xs shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Add Entertainment
          </button>
        </div>

        <Card title="Entertainment Summary">
          <div className="p-4 bg-pink-50 rounded-xl border border-pink-100 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-pink-600 text-white rounded-lg">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Total Monthly Discretionary Spend</span>
                <p className="text-2xl font-bold text-slate-900">₹{totalEntertainmentAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {items.length === 0 ? (
            <p className="text-center text-slate-500 py-8 text-sm">No entertainment items added yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider border-b">
                  <tr>
                    <th className="py-3 px-4">Item Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Monthly Amount</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-semibold text-slate-900">{item.name}</td>
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
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Entertainment' : 'Add Entertainment'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Name / Service</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Netflix Premium Plan"
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
                <option value="Movies">Movies</option>
                <option value="Restaurants">Restaurants</option>
                <option value="OTT">OTT</option>
                <option value="Games">Games</option>
                <option value="Shopping">Shopping</option>
                <option value="Hobbies">Hobbies</option>
                <option value="Subscriptions">Subscriptions</option>
                <option value="Trips">Trips</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="649"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
              />
            </div>

            <button type="submit" className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold">
              Save Entertainment Item
            </button>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};
