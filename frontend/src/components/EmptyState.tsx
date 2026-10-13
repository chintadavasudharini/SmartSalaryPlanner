import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Wallet, CreditCard, ShoppingBag, Target } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No financial data available",
  description = "Add your income and expenses to generate your salary plan."
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center max-w-2xl mx-auto my-6 shadow-sm">
      <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Wallet className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto">{description}</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-lg mx-auto">
        <button
          onClick={() => navigate('/income')}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" />
          Add Income
        </button>
        <button
          onClick={() => navigate('/emi')}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-sm transition"
        >
          <CreditCard className="w-4 h-4" />
          Add EMI
        </button>
        <button
          onClick={() => navigate('/expenses')}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
        >
          <ShoppingBag className="w-4 h-4" />
          Add Expense
        </button>
        <button
          onClick={() => navigate('/goals')}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition"
        >
          <Target className="w-4 h-4" />
          Add Goal
        </button>
      </div>
    </div>
  );
};
