import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  label?: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  className?: string;
}

export function FilterDropdown({
  label,
  value,
  options,
  onChange,
  className = '',
}: FilterDropdownProps) {
  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="sr-only">{label}</label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label || 'Filter'}
        className="appearance-none w-full h-10 pl-3 pr-9 text-sm bg-white border border-slate-200 rounded-lg text-[#0F172A] font-medium focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15 transition-colors cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}
