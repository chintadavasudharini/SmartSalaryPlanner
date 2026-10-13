import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <header className="bg-white border-b border-[#DDD6FE] px-8 py-4 flex items-center justify-between shadow-xs text-[#2E1065]">
      <div>
        <h2 className="text-xl font-bold text-[#2E1065]">Financial Workspace</h2>
        <p className="text-xs text-[#6B5B95]">Real-time Salary Allocation & Algorithmic Planning</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#EDE9FE] border border-[#DDD6FE] flex items-center justify-center text-[#6D28D9]">
          <UserIcon className="w-4 h-4" />
        </div>
        <div className="text-left">
          <span className="block text-xs font-semibold text-[#2E1065]">
            {currentUser?.displayName || currentUser?.email || 'User'}
          </span>
          <span className="block text-[10px] text-[#059669] font-medium">Session Active</span>
        </div>
      </div>
    </header>
  );
};
