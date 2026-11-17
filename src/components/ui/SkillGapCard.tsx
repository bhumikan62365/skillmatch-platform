import React from 'react';
import { BookOpen, ArrowUpRight } from 'lucide-react';
import { GapPriority } from '../../types';

interface SkillGapCardProps {
  skillName: string;
  category: string;
  priority: GapPriority;
  weight: number;
  affectedJobs: string[];
  onStartLearning: (skillName: string) => void;
}

const PRIORITY_STYLE: Record<GapPriority, { label: string; cls: string }> = {
  high: {
    label: 'High Priority',
    cls: 'bg-rose-50 text-rose-800 border-rose-200',
  },
  medium: {
    label: 'Medium Priority',
    cls: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  low: {
    label: 'Low Priority',
    cls: 'bg-slate-100 text-slate-700 border-slate-200',
  },
};

export function SkillGapCard({
  skillName,
  category,
  priority,
  weight,
  affectedJobs,
  onStartLearning,
}: SkillGapCardProps) {
  const badge = PRIORITY_STYLE[priority];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between gap-4">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">{category}</p>
            <h3 className="mt-1 text-base font-semibold text-[#0F172A] font-display">
              {skillName}
            </h3>
          </div>
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded-md border whitespace-nowrap shrink-0 ${badge.cls}`}
          >
            {badge.label}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
          <span className="font-mono-tabular">Avg Role Weight: {weight}/10</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">
            Required by {affectedJobs.length}{' '}
            {affectedJobs.length === 1 ? 'role' : 'roles'}
          </span>
        </div>

        <p className="mt-2.5 text-xs text-slate-600 line-clamp-2">
          Target roles: {affectedJobs.join(', ')}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onStartLearning(skillName)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2563EB] hover:text-blue-700 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Add to Learning Roadmap</span>
          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
