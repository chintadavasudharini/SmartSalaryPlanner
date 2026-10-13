import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Expense } from '../types';
import api from '../services/api';
import { Plus, Trash2, Edit3, ShoppingBag, ArrowUpDown, Filter } from 'lucide-react';

export const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Expense | null>(null);

  const [expenseName, setExpenseName] = useState('');
  const [category, setCategory] = useState('Shopping');
  const [amount, setAmount] = useState('');

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [sortDescending, setSortDescending] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await api.get<Expense[]>('/expenses');
      setExpenses(res.data);
      applyFilterAndSort(res.data, selectedCategoryFilter, sortDescending);
    } catch (e) {
      console.error(e);
    }
  };

  const applyFilterAndSort = (items: Expense[], cat: string, desc: boolean) => {
    let result = [...items];
    if (cat !== 'All') {
      result = result.filter(x => x.category === cat);
    }
    result.sort((a, b) => (desc ? b.amount - a.amount : a.amount - b.amount));
    setFilteredExpenses(result);
  };

  const handleCategoryFilterChange = (cat: string) => {
    setSelectedCategoryFilter(cat);
    applyFilterAndSort(expenses, cat, sortDescending);
  };

  const toggleSort = () => {
    const nextSort = !sortDescending;
    setSortDescending(nextSort);
    applyFilterAndSort(expenses, selectedCategoryFilter, nextSort);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setExpenseName('');
    setCategory('Shopping');
    setAmount('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Expense) => {
    setEditingItem(item);
    setExpenseName(item.expense_name);
    setCategory(item.category);
    setAmount(item.amount.toString());
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      expense_name: expenseName,
      category,
      amount: parseFloat(amount)
    };

    try {
      if (editingItem) {
        await api.put(`/expenses/${editingItem.id}`, payload);
      } else {
        await api.post('/expenses', payload);
      }
      setIsModalOpen(false);
      fetchExpenses();
    } catch (err) {
      alert('Error saving expense.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this expense?')) {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
    }
  };

  const totalExpenseAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">General Expense Tracking</h1>
            <p className="text-sm text-slate-500">Track and filter non-household monthly spending</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold text-xs shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Add Expense
          </button>
        </div>

        <Card title="Expenses Overview">
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-lg">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Total Monthly General Expenses</span>
                <p className="text-2xl font-bold text-slate-900">₹{totalExpenseAmount.toFixed(2)}</p>
              </div>
            </div>

            {/* Filter & Sort Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => handleCategoryFilterChange(e.target.value)}
                  className="bg-transparent text-slate-700 font-medium outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="Transport">Transport</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Medical">Medical</option>
                  <option value="Education">Education</option>
                  <option value="Personal Care">Personal Care</option>
                  <option value="Travel">Travel</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button
                onClick={toggleSort}
                className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                Sort: {sortDescending ? 'Highest First' : 'Lowest First'}
              </button>
            </div>
          </div>

          {filteredExpenses.length === 0 ? (
            <p className="text-center text-slate-500 py-8 text-sm">No expenses match your criteria.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider border-b">
                  <tr>
                    <th className="py-3 px-4">Expense Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Monthly Amount</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredExpenses.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-semibold text-slate-900">{item.expense_name}</td>
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
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Expense' : 'Add Expense'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Expense Name</label>
              <input
                type="text"
                required
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                placeholder="e.g. Weekend Clothing Shopping"
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
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Medical">Medical</option>
                <option value="Education">Education</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Travel">Travel</option>
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
                placeholder="3000"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
              />
            </div>

            <button type="submit" className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold">
              Save Expense
            </button>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};
