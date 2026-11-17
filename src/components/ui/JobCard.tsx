import React from 'react';
import { ArrowRight, CheckCircle2, MapPin } from 'lucide-react';
import { JobMatchBreakdown } from '../../types';
import { ProgressBar } from './ProgressBar';
import { SkillBadge } from './SkillBadge';

interface JobCardProps {
  breakdown: JobMatchBreakdown;
  hasApplied: boolean;
  onViewDetails: (jobId: string) => void;
  onApply: (jobId: string) => void;
}

export function JobCard({
  breakdown,
  hasApplied,
  onViewDetails,
  onApply,
}: JobCardProps) {
  const { job, matchScore, matchedRequiredSkills, missingRequiredSkills } = breakdown;
  const tone = matchScore >= 75 ? 'emerald' : matchScore >= 50 ? 'blue' : 'amber';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between gap-4 hover:border-slate-300 transition-colors">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500 truncate">
              {job.company} · {job.jobType}
            </p>
            <h3 className="mt-1 text-base font-semibold text-[#0F172A] font-display leading-snug">
              {job.title}
            </h3>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xl font-bold text-[#2563EB] font-display tabular-nums">
              {matchScore}%
            </span>
            <p className="text-[11px] text-slate-500">Match</p>
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            {job.location}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-tabular">{job.salaryRange}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-tabular">Min CGPA {job.minCgpa.toFixed(1)}</span>
        </div>

        <div className="mt-4">
          <ProgressBar value={matchScore} tone={tone} size="sm" />
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {matchedRequiredSkills.slice(0, 3).map((sk) => (
            <SkillBadge
              key={sk.name}
              name={sk.name}
              evidenceType={sk.evidenceType}
            />
          ))}
          {missingRequiredSkills.slice(0, 2).map((sk) => (
            <SkillBadge key={sk.name} name={sk.name} evidenceType="missing" />
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onViewDetails(job.id)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-[#2563EB] whitespace-nowrap shrink-0 transition-colors cursor-pointer"
        >
          <span>View Match Details</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>

        {hasApplied ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 whitespace-nowrap shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            Applied
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onApply(job.id)}
            className="px-3.5 py-2 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
}
