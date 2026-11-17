import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCheck,
  TrendingUp,
  Briefcase,
  Target,
  ArrowRight,
  BookOpen,
  FileSearch,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DashboardLayout } from '../../components/ui/DashboardLayout';
import { StatCard } from '../../components/ui/StatCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { SkillBadge } from '../../components/ui/SkillBadge';
import { JobCard } from '../../components/ui/JobCard';
import {
  calculateEmployabilityScore,
  calculateJobMatch,
  calculateProfileCompletion,
} from '../../services/matchingEngine';

export function StudentDashboard() {
  const { activeStudent, jobs, learningResources, activities, applyToJob } =
    useApp();
  const navigate = useNavigate();

  const profileCompletion = useMemo(
    () => calculateProfileCompletion(activeStudent),
    [activeStudent]
  );

  const employabilityScore = useMemo(
    () => calculateEmployabilityScore(activeStudent, jobs),
    [activeStudent, jobs]
  );

  const jobMatches = useMemo(() => {
    return jobs
      .map((job) => calculateJobMatch(activeStudent, job))
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [activeStudent, jobs]);

  const qualifiedCount = useMemo(
    () => jobMatches.filter((m) => m.matchScore >= 60).length,
    [jobMatches]
  );

  const uniqueMissingSkills = useMemo(() => {
    const map = new Map<string, number>();
    jobMatches.forEach((m) => {
      m.missingRequiredSkills.forEach((sk) => {
        map.set(sk.name, Math.max(map.get(sk.name) || 0, sk.weight));
      });
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [jobMatches]);

  const verifiedSkillsCount = activeStudent.skills.filter(
    (s) => s.evidenceType !== 'resume_mentioned'
  ).length;
  const resumeOnlyCount = activeStudent.skills.length - verifiedSkillsCount;

  const studentActivities = activities
    .filter((a) => a.actorRole === 'student')
    .slice(0, 4);

  const recommendedResources = learningResources
    .filter((r) => r.status !== 'completed')
    .slice(0, 3);

  return (
    <DashboardLayout title="Student Dashboard" breadcrumb="Student Portal / Overview">
      {/* Welcome & Quick Action Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500">
            {activeStudent.institution} · {activeStudent.department} · Batch{' '}
            {activeStudent.graduationYear}
          </p>
          <h2 className="mt-1 text-xl font-bold text-[#0F172A] font-display">
            Welcome back, {activeStudent.name.split(' ')[0]}
          </h2>
          <p className="mt-1 text-sm text-slate-600 max-w-2xl">
            Your skills and projects are continuously evaluated against active industry requisitions using weighted skill matching.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/student/resume')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <FileSearch className="w-4 h-4" aria-hidden="true" />
            <span>Analyze Resume</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/student/jobs')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Explore Matched Jobs</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
        <StatCard
          label="Profile Completion"
          value={`${profileCompletion}%`}
          hint={
            profileCompletion < 100
              ? 'Add certifications or projects to reach 100%'
              : 'All sections verified'
          }
          icon={UserCheck}
          tone="blue"
          onClick={() => navigate('/student/profile')}
        />
        <StatCard
          label="Employability Score"
          value={`${employabilityScore}%`}
          hint={`${verifiedSkillsCount} project-verified · ${resumeOnlyCount} resume-only`}
          icon={TrendingUp}
          tone="emerald"
          onClick={() => navigate('/student/skills')}
        />
        <StatCard
          label="Matched Jobs (≥60%)"
          value={qualifiedCount}
          hint={`${activeStudent.appliedJobIds.length} applications submitted`}
          icon={Briefcase}
          tone="blue"
          onClick={() => navigate('/student/jobs')}
        />
        <StatCard
          label="Identified Skill Gaps"
          value={uniqueMissingSkills.length}
          hint="Prioritized by job weight demand"
          icon={Target}
          tone="amber"
          onClick={() => navigate('/student/skill-gaps')}
        />
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left 2 Columns: Technical Skill Overview + Recent Job Matches */}
        <div className="lg:col-span-2 space-y-6">
          {/* Technical Skill Overview */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-semibold text-[#0F172A] font-display">
                  Technical Skill Overview
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Distinguishes practical project evidence from resume-only mentions
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/student/skills')}
                className="text-xs font-medium text-[#2563EB] hover:text-blue-700 whitespace-nowrap cursor-pointer"
              >
                Manage Skills
              </button>
            </div>

            {activeStudent.skills.length === 0 ? (
              <div className="py-6 text-center border border-dashed border-slate-200 rounded-lg">
                <p className="text-sm font-medium text-[#0F172A]">No skills added yet</p>
                <p className="text-xs text-slate-500 mt-1">
                  Upload your resume or add verified skills manually.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/student/resume')}
                  className="mt-3 px-3.5 py-2 text-xs font-medium text-white bg-[#2563EB] rounded-lg cursor-pointer"
                >
                  Upload Resume
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-2">
                  {activeStudent.skills.map((sk) => (
                    <SkillBadge
                      key={sk.id}
                      name={sk.name}
                      evidenceType={sk.evidenceType}
                      title={sk.evidenceSource}
                    />
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ProgressBar
                    value={verifiedSkillsCount}
                    max={Math.max(1, activeStudent.skills.length)}
                    label="Practical Evidence Coverage"
                    showValue
                    tone="emerald"
                  />
                  <ProgressBar
                    value={profileCompletion}
                    label="Profile Completeness"
                    showValue
                    tone="blue"
                  />
                </div>
              </>
            )}
          </div>

          {/* Recent Job Matches */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-[#0F172A] font-display">
                Top Job Matches
              </h3>
              <button
                type="button"
                onClick={() => navigate('/student/jobs')}
                className="text-xs font-medium text-[#2563EB] hover:text-blue-700 cursor-pointer"
              >
                View all {jobs.length} roles
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobMatches.slice(0, 2).map((breakdown) => (
                <JobCard
                  key={breakdown.job.id}
                  breakdown={breakdown}
                  hasApplied={activeStudent.appliedJobIds.includes(breakdown.job.id)}
                  onViewDetails={(id) => navigate(`/student/jobs/${id}`)}
                  onApply={applyToJob}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recommended Learning & Recent Activity */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-[#0F172A] font-display">
                Recommended Learning
              </h3>
              <button
                type="button"
                onClick={() => navigate('/student/roadmap')}
                className="text-xs font-medium text-[#2563EB] hover:text-blue-700 cursor-pointer"
              >
                Roadmap
              </button>
            </div>
            <div className="space-y-3">
              {recommendedResources.map((res) => (
                <div
                  key={res.id}
                  className="p-3.5 rounded-lg border border-slate-200/80 bg-slate-50/50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#0F172A]">
                      {res.skillName}
                    </span>
                    <span className="text-[11px] font-mono-tabular text-slate-500">
                      {res.estimatedHours}h
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{res.topic}</p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{res.provider}</span>
                    <a
                      href={res.resourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[#2563EB] font-medium hover:underline"
                    >
                      <BookOpen className="w-3 h-3" />
                      Open
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <h3 className="text-base font-semibold text-[#0F172A] font-display mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {studentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3">
                  <Clock
                    className="w-4 h-4 text-slate-400 mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#0F172A]">
                      {act.title}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {act.detail} · {act.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
