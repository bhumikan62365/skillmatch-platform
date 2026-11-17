import React from 'react';
import { CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { JobMatchBreakdown } from '../../types';
import { ProgressBar } from './ProgressBar';

interface MatchScoreCardProps {
  breakdown: JobMatchBreakdown;
}

export function MatchScoreCard({ breakdown }: MatchScoreCardProps) {
  const tone =
    breakdown.matchScore >= 75
      ? 'emerald'
      : breakdown.matchScore >= 50
      ? 'blue'
      : 'amber';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
      <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Explainable Compatibility Score
          </p>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-4xl font-bold text-[#0F172A] font-display tabular-nums">
              {breakdown.matchScore}%
            </span>
            <span className="text-xs text-slate-500 font-mono-tabular">
              ({breakdown.matchedWeight} / {breakdown.totalRequiredWeight} required skill weight)
            </span>
          </div>
        </div>

        <div className="text-right">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border ${
              breakdown.isEligible
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {breakdown.isEligible ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            )}
            {breakdown.isEligible ? 'Eligibility Met' : 'Eligibility Check Required'}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <ProgressBar
          value={breakdown.matchScore}
          tone={tone}
          label="Weighted Required Skill Alignment"
          showValue
        />
        <p className="mt-2.5 text-xs text-slate-500 font-mono-tabular">
          Formula: ({breakdown.matchedWeight} Matched Required Weight /{' '}
          {breakdown.totalRequiredWeight} Total Required Weight) × 100 ={' '}
          {breakdown.matchScore}%
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <p className="font-semibold text-[#0F172A] tabular-nums">
              {breakdown.practicalEvidenceCount} Practical Verified
            </p>
            <p className="text-slate-500">Backed by projects or credentials</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <FileText className="w-4 h-4 text-[#2563EB] shrink-0" />
          <div>
            <p className="font-semibold text-[#0F172A] tabular-nums">
              {breakdown.resumeOnlyCount} Resume Mentioned
            </p>
            <p className="text-slate-500">Unverified by project evidence</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <div>
            <p className="font-semibold text-[#0F172A] tabular-nums">
              {breakdown.missingRequiredSkills.length} Missing Required
            </p>
            <p className="text-slate-500">Recommended for learning plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
