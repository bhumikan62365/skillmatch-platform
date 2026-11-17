import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BookOpen,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DashboardLayout } from '../../components/ui/DashboardLayout';
import { MatchScoreCard } from '../../components/ui/MatchScoreCard';
import { SkillBadge } from '../../components/ui/SkillBadge';
import { calculateJobMatch } from '../../services/matchingEngine';

export function JobMatchDetails() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { activeStudent, jobs, applyToJob, addLearningResource, learningResources } =
    useApp();

  const job = jobs.find((j) => j.id === jobId) || jobs[0];

  const breakdown = useMemo(
    () => calculateJobMatch(activeStudent, job),
    [activeStudent, job]
  );

  const hasApplied = activeStudent.appliedJobIds.includes(job.id);

  const handleQueueLearning = (skillName: string, category: typeof job.requiredSkills[0]['category'], weight: number) => {
    const exists = learningResources.some(
      (r) => r.skillName.toLowerCase() === skillName.toLowerCase()
    );
    if (!exists) {
      addLearningResource({
        skillName,
        category,
        topic: `${skillName} Practical Foundations & Production Patterns`,
        provider: 'Official Documentation & Guided Labs',
        resourceUrl: 'https://roadmap.sh',
        priority: weight >= 8 ? 'high' : weight >= 5 ? 'medium' : 'low',
        estimatedHours: 10,
        status: 'pending',
        reason: `Required for ${job.title} at ${job.company} (weight ${weight}/10).`,
      });
    }
    navigate('/student/roadmap');
  };

  return (
    <DashboardLayout
      title={job.title}
      breadcrumb={`Student Portal / Find Jobs / ${job.company}`}
    >
      <div className="mb-4">
        <button
          type="button"
          onClick={() => navigate('/student/jobs')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#0F172A] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Find Jobs</span>
        </button>
      </div>

      {/* Header Overview Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[#2563EB]">
            {job.company} · {job.jobType}
          </p>
          <h2 className="mt-1 text-xl font-bold text-[#0F172A] font-display">
            {job.title}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {job.location}
            </span>
            <span className="font-mono-tabular">{job.salaryRange}</span>
            <span className="inline-flex items-center gap-1 font-mono-tabular">
              <Calendar className="w-3.5 h-3.5" />
              Apply by {job.expiryDate}
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-600 max-w-3xl leading-relaxed">
            {job.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href={job.applicationUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg whitespace-nowrap"
          >
            <span>Company Listing</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {hasApplied ? (
            <span className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg whitespace-nowrap">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Application Submitted
            </span>
          ) : (
            <button
              type="button"
              onClick={() => applyToJob(job.id)}
              className="px-5 py-2.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg whitespace-nowrap cursor-pointer"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>

      {/* Explainable Score Breakdown */}
      <div className="mt-6">
        <MatchScoreCard breakdown={breakdown} />
      </div>

      {/* Detailed Matched vs Missing + Eligibility */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Matched Required Skills */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <h3 className="text-base font-semibold text-[#0F172A] font-display mb-1">
              Matched Required Skills ({breakdown.matchedRequiredSkills.length})
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Each required skill contributes its role weight to your numerator.
            </p>

            {breakdown.matchedRequiredSkills.length === 0 ? (
              <p className="text-xs text-slate-500">
                No required skills matched yet. Upload your resume or add projects.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {breakdown.matchedRequiredSkills.map((sk) => (
                  <div
                    key={sk.name}
                    className="py-3 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <SkillBadge
                        name={sk.name}
                        evidenceType={sk.evidenceType}
                        weight={sk.weight}
                      />
                    </div>
                    <span className="text-xs text-slate-500">
                      {sk.evidenceSource}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Missing Required Skills & Suggestions */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <h3 className="text-base font-semibold text-[#0F172A] font-display mb-1">
              Missing Required Skills ({breakdown.missingRequiredSkills.length})
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Closing these gaps increases your weighted compatibility score directly.
            </p>

            {breakdown.missingRequiredSkills.length === 0 ? (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>You satisfy 100% of required technical skills for this role.</span>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {breakdown.missingRequiredSkills.map((sk) => (
                  <div
                    key={sk.name}
                    className="py-3 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <SkillBadge
                        name={sk.name}
                        evidenceType="missing"
                        weight={sk.weight}
                      />
                      <span className="text-xs text-slate-500">
                        +{Math.round((sk.weight / breakdown.totalRequiredWeight) * 100)}% potential score gain
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleQueueLearning(sk.name, sk.category, sk.weight)
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2563EB] hover:text-blue-700 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Start Learning</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Preferred Skills & Eligibility Requirements */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <h3 className="text-base font-semibold text-[#0F172A] font-display mb-4">
              Eligibility Requirements
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <p className="font-medium text-[#0F172A]">Minimum CGPA</p>
                  <p className="text-slate-500 font-mono-tabular mt-0.5">
                    Required: {job.minCgpa.toFixed(2)} · Yours:{' '}
                    {activeStudent.cgpa.toFixed(2)}
                  </p>
                </div>
                {breakdown.cgpaEligible ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
              </div>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-[#0F172A]">
                    Eligible Departments
                  </p>
                  <p className="text-slate-500 mt-0.5">
                    {job.eligibleDepartments.join(', ')}
                  </p>
                </div>
                {breakdown.departmentEligible ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <h3 className="text-base font-semibold text-[#0F172A] font-display mb-3">
              Preferred Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.preferredSkills.map((pref) => {
                const matched = breakdown.matchedPreferredSkills.includes(pref);
                return (
                  <SkillBadge
                    key={pref}
                    name={pref}
                    evidenceType={matched ? 'project_verified' : 'neutral'}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
