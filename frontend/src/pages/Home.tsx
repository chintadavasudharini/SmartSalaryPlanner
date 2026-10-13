import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  CreditCard,
  Home as HomeIcon,
  ShoppingBag,
  PiggyBank,
  TrendingUp,
  Film,
  Target,
  Calculator,
  Bot,
  ArrowRight
} from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const steps = [
    'Enter salary & income sources',
    'Add financial commitments (EMI)',
    'Add household essential expenses',
    'Set savings & investment amounts',
    'Create financial goals with deadlines',
    'Generate algorithmic salary plan',
    'Get personalized AI recommendations'
  ];

  const features = [
    { title: 'Income Management', desc: 'Track salary, freelance, and bonus income.', icon: Wallet },
    { title: 'EMI Management', desc: 'Deterministic loan compound interest calculation.', icon: CreditCard },
    { title: 'Household Expenses', desc: 'Monitor rent, groceries, electricity, and bills.', icon: HomeIcon },
    { title: 'Expense Tracking', desc: 'Classify non-essential and personal spending.', icon: ShoppingBag },
    { title: 'Savings', desc: 'Calculate required monthly savings contributions.', icon: PiggyBank },
    { title: 'Investments', desc: 'Track SIPs, mutual funds, FDs, and stocks.', icon: TrendingUp },
    { title: 'Entertainment', desc: 'Monitor discretionary entertainment spending.', icon: Film },
    { title: 'Financial Goals', desc: 'Track progress toward emergency funds, cars, and homes.', icon: Target },
    { title: 'Salary Planner', desc: 'Greedy & DP algorithmic allocation strategies.', icon: Calculator },
    { title: 'AI Salary Manager', desc: 'Personalized advice powered by Gemini AI API.', icon: Bot }
  ];

  return (
    <div className="min-h-screen bg-[#EDE9FE] text-[#2E1065] flex flex-col">
      {/* Navbar */}
      <header className="border-b border-[#DDD6FE] bg-white/80 backdrop-blur-sm px-8 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7C3AED] flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-[#7C3AED]/30">
            S
          </div>
          <div>
            <span className="font-bold text-lg text-[#2E1065] block">SalaryFlow</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-sm font-medium text-[#6B5B95] hover:text-[#2E1065] transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-[#7C3AED] hover:bg-[#5B21B6] text-white shadow-md shadow-[#7C3AED]/30 transition"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-8 py-20 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#2E1065] mb-6 leading-tight">
          SalaryFlow
        </h1>
        <p className="text-xl md:text-2xl text-[#6B5B95] mb-8 font-light">
          Track, plan & manage your income
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-3.5 rounded-xl bg-[#7C3AED] hover:bg-[#5B21B6] text-white font-bold text-base shadow-lg shadow-[#7C3AED]/25 flex items-center gap-2 transition"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3.5 rounded-xl border border-[#DDD6FE] bg-white hover:bg-[#EDE9FE] text-[#2E1065] font-bold text-base transition"
          >
            Login
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="px-8 py-16 bg-white/70 border-y border-[#DDD6FE]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#2E1065] mb-12">
            How SalaryFlow Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white border border-[#DDD6FE] p-4 rounded-xl text-center relative shadow-xs">
                <span className="w-7 h-7 rounded-full bg-[#7C3AED] text-white font-bold text-xs flex items-center justify-center mx-auto mb-3">
                  {idx + 1}
                </span>
                <p className="text-xs font-medium text-[#6B5B95] leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Major Features */}
      <section className="px-8 py-20 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#2E1065] mb-12">
          Core Financial Planning Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="bg-white border border-[#DDD6FE] p-5 rounded-xl hover:border-[#7C3AED] transition shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#2E1065] mb-1">{feat.title}</h3>
                <p className="text-xs text-[#6B5B95] leading-normal">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="mt-auto border-t border-[#DDD6FE] py-8 text-center text-xs text-[#6B5B95] bg-white/50">
        SalaryFlow — Powered by Python FastAPI, Firebase Auth & Firestore, and Gemini AI.
      </footer>
    </div>
  );
};
