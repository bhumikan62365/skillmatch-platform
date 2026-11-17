import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  tone?: 'blue' | 'emerald' | 'amber' | 'rose' | 'slate';
  size?: 'sm' | 'md';
}

const TONE_CLASSES: Record<NonNullable<ProgressBarProps['tone']>, string> = {
  blue: 'bg-[#2563EB]',
  emerald: 'bg-emerald-600',
  amber: 'bg-amber-500',
  rose: 'bg-rose-600',
  slate: 'bg-[#0F172A]',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  tone = 'blue',
  size = 'md',
}: ProgressBarProps) {
  const pct = max > 0 ? Math.max(0, Math.min(100, Math.round((value / max) * 100))) : 0;

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs mb-1.5">
          {label ? <span className="font-medium text-slate-700">{label}</span> : <span />}
          {showValue && (
            <span className="font-mono-tabular font-semibold text-slate-900 tabular-nums">
              {pct}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-slate-100 rounded-full overflow-hidden ${
          size === 'sm' ? 'h-1.5' : 'h-2'
        }`}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${TONE_CLASSES[tone]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
