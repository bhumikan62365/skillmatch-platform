import React, { useMemo, useState } from 'react';
import { ExternalLink, CheckCircle2, Clock, Circle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DashboardLayout } from '../../components/ui/DashboardLayout';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { LearningStatus } from '../../types';

export function LearningRoadmap() {
  const { learningResources, updateLearningStatus } = useApp();
  const [statusFilter, setStatusFilter] = useState<'all' | LearningStatus>('all');

  const completedCount = learningResources.filter(
    (r) => r.status === 'completed'
  ).length;
  const totalHoursRemaining = learningResources
    .filter((r) => r.status !== 'completed')
    .reduce((acc, r) => acc + r.estimatedHours, 0);

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return learningResources;
    return learningResources.filter((r) => r.status === statusFilter);
  }, [learningResources, statusFilter]);

  return (
    <DashboardLayout
      title="Learning Roadmap"
      breadcrumb="Student Portal / Learning Roadmap"
    >
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#0F172A] font-display">
              Personalized Skill-Closing Roadmap
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
              {completedCount} of {learningResources.length} topics completed ·{' '}
              {totalHoursRemaining} estimated hours remaining
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
            {(
              [
                { label: 'All', value: 'all' },
                { label: 'Pending', value: 'pending' },
                { label: 'In Progress', value: 'in_progress' },
                { label: 'Completed', value: 'completed' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer ${
                  statusFilter === tab.value
                    ? 'bg-white text-[#0F172A] shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <ProgressBar
            value={completedCount}
            max={Math.max(1, learningResources.length)}
            label="Overall Roadmap Progress"
            showValue
            tone="emerald"
          />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {filtered.map((item) => {
          const priorityCls =
            item.priority === 'high'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : item.priority === 'medium'
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-slate-100 text-slate-700 border-slate-200';

          return (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-[#2563EB]">
                    {item.skillName}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">{item.category}</span>
                  <span className="text-slate-400">·</span>
                  <span
                    className={`px-2 py-0.5 rounded border text-[11px] font-medium ${priorityCls}`}
                  >
                    {item.priority.charAt(0).toUpperCase() +
                      item.priority.slice(1)}{' '}
                    Priority
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="font-mono-tabular text-slate-500">
                    {item.estimatedHours} hrs est.
                  </span>
                </div>

                <h3 className="text-base font-semibold text-[#0F172A] font-display">
                  {item.topic}
                </h3>
                <p className="text-xs text-slate-600">{item.reason}</p>
                <div className="pt-1">
                  <a
                    href={item.resourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#2563EB] hover:underline"
                  >
                    <span>{item.provider}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {(
                  [
                    {
                      value: 'pending',
                      label: 'Pending',
                      icon: Circle,
                    },
                    {
                      value: 'in_progress',
                      label: 'In Progress',
                      icon: Clock,
                    },
                    {
                      value: 'completed',
                      label: 'Completed',
                      icon: CheckCircle2,
                    },
                  ] as const
                ).map((opt) => {
                  const Icon = opt.icon;
                  const active = item.status === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateLearningStatus(item.id, opt.value)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                        active
                          ? opt.value === 'completed'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : opt.value === 'in_progress'
                            ? 'bg-blue-50 border-blue-300 text-[#2563EB]'
                            : 'bg-slate-100 border-slate-300 text-[#0F172A]'
                          : 'bg-white border-slate-200 text-slate-500 hover:text-[#0F172A]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
