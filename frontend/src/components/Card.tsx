import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, subtitle, children, className = '', action }) => {
  return (
    <div className={`bg-white rounded-xl border border-[#DDD6FE] shadow-sm p-6 text-[#2E1065] ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#DDD6FE]">
          <div>
            {title && <h3 className="text-lg font-semibold text-[#2E1065]">{title}</h3>}
            {subtitle && <p className="text-xs text-[#6B5B95] mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
