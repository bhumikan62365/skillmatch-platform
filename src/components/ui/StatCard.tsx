import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: 'blue' | 'slate' | 'emerald' | 'amber';
  onClick?: () => void;
}

const ICON_TONE: Record<NonNullable<StatCardProps['tone']>, string> = {
  blue: 'bg-blue-50 text-[#2563EB]',
  slate: 'bg-slate-100 text-[#0F172A]',
  emerald: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'blue',
  onClick,
}: StatCardProps) {
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`w-full text-left bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs transition-all duration-150 ${
        onClick
          ? 'hover:border-blue-300 hover:shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2563EB]'
          : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500 truncate">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A] font-display tabular-nums">
            {value}
          </p>
          {hint && (
            <p className="mt-1.5 text-xs text-slate-500 truncate">{hint}</p>
          )}
        </div>
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${ICON_TONE[tone]}`}
        >
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
      </div>
    </Wrapper>
  );
}
