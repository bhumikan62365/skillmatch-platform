import React from 'react';
import { CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import { SkillEvidenceType } from '../../types';

interface SkillBadgeProps {
  name: string;
  evidenceType?: SkillEvidenceType | 'missing' | 'neutral';
  weight?: number;
  title?: string;
}

export function SkillBadge({
  name,
  evidenceType = 'neutral',
  weight,
  title,
}: SkillBadgeProps) {
  if (evidenceType === 'project_verified' || evidenceType === 'certification_verified') {
    return (
      <span
        title={
          title ||
          (evidenceType === 'project_verified'
            ? 'Verified by practical project'
            : 'Verified by certification / academic record')
        }
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80 whitespace-nowrap"
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
        <span>{name}</span>
        {weight !== undefined && (
          <span className="font-mono-tabular text-[11px] text-emerald-700/80">
            · w{weight}
          </span>
        )}
      </span>
    );
  }

  if (evidenceType === 'resume_mentioned') {
    return (
      <span
        title={title || 'Mentioned in resume (no practical project verification yet)'}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200/80 whitespace-nowrap"
      >
        <FileText className="w-3.5 h-3.5 text-[#2563EB] shrink-0" aria-hidden="true" />
        <span>{name}</span>
        {weight !== undefined && (
          <span className="font-mono-tabular text-[11px] text-blue-700/80">
            · w{weight}
          </span>
        )}
      </span>
    );
  }

  if (evidenceType === 'missing') {
    return (
      <span
        title={title || 'Missing required skill'}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200/80 whitespace-nowrap"
      >
        <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" aria-hidden="true" />
        <span>{name}</span>
        {weight !== undefined && (
          <span className="font-mono-tabular text-[11px] text-rose-700/80">
            · w{weight}
          </span>
        )}
      </span>
    );
  }

  return (
    <span
      title={title}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/70 whitespace-nowrap"
    >
      <span>{name}</span>
      {weight !== undefined && (
        <span className="font-mono-tabular text-[11px] text-slate-500">
          · w{weight}
        </span>
      )}
    </span>
  );
}
