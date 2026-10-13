import React from 'react';

interface StatCardProps {
  label: string;
  amount: number;
  icon?: React.ReactNode;
  color?: 'income' | 'expense' | 'savings' | 'investment' | 'goal' | 'warning' | 'primary' | 'slate';
  subtext?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  amount,
  icon,
  color = 'primary',
  subtext
}) => {
  const colorStyles: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
    income: { bg: 'bg-[#059669]/10', text: 'text-[#059669]', border: 'border-[#059669]/30', iconBg: 'bg-[#059669]/20' },
    expense: { bg: 'bg-[#E11D48]/10', text: 'text-[#E11D48]', border: 'border-[#E11D48]/30', iconBg: 'bg-[#E11D48]/20' },
    savings: { bg: 'bg-[#0891B2]/10', text: 'text-[#0891B2]', border: 'border-[#0891B2]/30', iconBg: 'bg-[#0891B2]/20' },
    investment: { bg: 'bg-[#D97706]/10', text: 'text-[#D97706]', border: 'border-[#D97706]/30', iconBg: 'bg-[#D97706]/20' },
    goal: { bg: 'bg-[#7C3AED]/10', text: 'text-[#7C3AED]', border: 'border-[#7C3AED]/30', iconBg: 'bg-[#7C3AED]/20' },
    warning: { bg: 'bg-[#EA580C]/10', text: 'text-[#EA580C]', border: 'border-[#EA580C]/30', iconBg: 'bg-[#EA580C]/20' },
    primary: { bg: 'bg-[#6D28D9]/10', text: 'text-[#6D28D9]', border: 'border-[#6D28D9]/30', iconBg: 'bg-[#6D28D9]/20' },
    slate: { bg: 'bg-[#6B5B95]/10', text: 'text-[#2E1065]', border: 'border-[#DDD6FE]', iconBg: 'bg-[#DDD6FE]' }
  };

  const activeStyle = colorStyles[color] || colorStyles.primary;

  return (
    <div className={`p-5 rounded-xl border bg-white shadow-xs ${activeStyle.border} transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#6B5B95]">{label}</span>
        {icon && <div className={`p-2 rounded-lg ${activeStyle.iconBg} ${activeStyle.text}`}>{icon}</div>}
      </div>
      <div className="mt-3">
        <span className={`text-2xl font-bold ${activeStyle.text}`}>
          ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
      {subtext && <p className="text-xs text-[#6B5B95] mt-1">{subtext}</p>}
    </div>
  );
};
