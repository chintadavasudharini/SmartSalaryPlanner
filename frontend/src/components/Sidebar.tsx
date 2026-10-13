import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  Home,
  ShoppingBag,
  PiggyBank,
  TrendingUp,
  Film,
  Target,
  Calculator,
  Bot,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Income', path: '/income', icon: Wallet },
    { label: 'EMI', path: '/emi', icon: CreditCard },
    { label: 'Household', path: '/household', icon: Home },
    { label: 'Expenses', path: '/expenses', icon: ShoppingBag },
    { label: 'Savings', path: '/savings', icon: PiggyBank },
    { label: 'Investments', path: '/investments', icon: TrendingUp },
    { label: 'Entertainment', path: '/entertainment', icon: Film },
    { label: 'Goals', path: '/goals', icon: Target },
    { label: 'Salary Planner', path: '/salary-planner', icon: Calculator },
    { label: 'AI Salary Manager', path: '/ai-manager', icon: Bot },
  ];

  return (
    <aside className="w-64 bg-white text-[#2E1065] min-h-screen flex flex-col border-r border-[#DDD6FE]">
      <div className="p-6 border-b border-[#DDD6FE]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#7C3AED] flex items-center justify-center text-white font-bold text-lg shadow-md shadow-[#7C3AED]/20">
            S
          </div>
          <div>
            <h1 className="font-bold text-[#2E1065] text-base leading-tight">SalaryFlow</h1>
            <p className="text-[11px] text-[#6B5B95] font-medium">Track, plan & manage your income</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-[#7C3AED] text-white shadow-sm shadow-[#7C3AED]/30'
                    : 'text-[#6B5B95] hover:text-[#2E1065] hover:bg-[#EDE9FE]'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#DDD6FE]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
