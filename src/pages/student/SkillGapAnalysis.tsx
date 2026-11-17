import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { DashboardLayout } from '../../components/ui/DashboardLayout';
import { AnalyticsChart } from '../../components/ui/AnalyticsChart';
import { SkillGapCard } from '../../components/ui/SkillGapCard';
import { FilterDropdown } from '../../components/ui/FilterDropdown';
import { calculateJobMatch } from '../../services/matchingEngine';
import { GapPriority, SkillCategory } from '../../types';

export function SkillGapAnalysis() {
  const { activeStudent, jobs, learningResources, addLearningResource } =
    useApp();
  const navigate = useNavigate();

  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const aggregatedGaps = useMemo(() => {
    const targetJobs =
      selectedJobId === 'all'
        ? jobs
        : jobs.filter((j) => j.id === selectedJobId);

    const map = new Map<
      string,
      {
        skillName: string;
        category: SkillCategory;
        totalWeight: number;
        count: number;
        jobs: string[];
      }
    >();

    targetJobs.forEach((job) => {
      const match = calculateJobMatch(activeStudent, job);
      match.missingRequiredSkills.forEach((sk) => {
        const existing = map.get(sk.name);
        if (existing) {
          existing.totalWeight += sk.weight;
          existing.count += 1;
          existing.jobs.push(`${job.company} (${job.title})`);
        } else {
          map.set(sk.name, {
            skillName: sk.name,
            category: sk.category,
            totalWeight: sk.weight,
            count: 1,
            jobs: [`${job.company} (${job.title})`],
          });
        }
      });
    });

    return Array.from(map.values())
      .map((item) => {
        const avgWeight = Math.round(item.totalWeight / item.count);
        const priority: GapPriority =
          avgWeight >= 8 || item.count >= 2
            ? 'high'
            : avgWeight >= 6
            ? 'medium'
            : 'low';
        return { ...item, avgWeight, priority };
      })
      .filter((item) => priorityFilter === 'all' || item.priority === priorityFilter)
      .sort((a, b) => b.totalWeight - a.totalWeight);
  }, [activeStudent, jobs, selectedJobId, priorityFilter]);

  const categoryComparisonData = useMemo(() => {
    const categories: SkillCategory[] = [
      'Programming Languages',
      'Web Development',
      'Database Technologies',
      'AI/ML',
      'Development Tools',
      'Core Computer Science',
    ];

    return categories.map((cat) => {
      const studentCount = activeStudent.skills.filter(
        (s) => s.category === cat
      ).length;
      const marketRequired = new Set(
        jobs
          .flatMap((j) => j.requiredSkills)
          .filter((rs) => rs.category === cat)
          .map((rs) => rs.name.toLowerCase())
      ).size;
      return {
        category: cat.replace(' Technologies', '').replace(' Computer Science', ' CS'),
        Yours: studentCount,
        Market: marketRequired,
      };
    });
  }, [activeStudent.skills, jobs]);

  const handleStartLearning = (skillName: string) => {
    const gap = aggregatedGaps.find((g) => g.skillName === skillName);
    const exists = learningResources.some(
      (r) => r.skillName.toLowerCase() === skillName.toLowerCase()
    );
    if (!exists && gap) {
      addLearningResource({
        skillName: gap.skillName,
        category: gap.category,
        topic: `${gap.skillName} Applied Engineering & Interview Prep`,
        provider: 'Curated Documentation Track',
        resourceUrl: 'https://roadmap.sh',
        priority: gap.priority,
        estimatedHours: 10,
        status: 'pending',
        reason: `Required by ${gap.jobs.join(', ')}`,
      });
    }
    navigate('/student/roadmap');
  };

  return (
    <DashboardLayout
      title="Skill Gap Analysis"
      breadcrumb="Student Portal / Skill Gap Analysis"
    >
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#0F172A] font-display">
            Competency vs Market Demand
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify missing technical competencies prioritized by job weight and multi-role frequency.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <FilterDropdown
            label="Target Job"
            value={selectedJobId}
            onChange={setSelectedJobId}
            options={[
              { label: 'All Target Jobs', value: 'all' },
              ...jobs.map((j) => ({
                label: `${j.company} — ${j.title}`,
                value: j.id,
              })),
            ]}
            className="w-64"
          />
          <FilterDropdown
            label="Priority"
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={[
              { label: 'All Priorities', value: 'all' },
              { label: 'High Priority', value: 'high' },
              { label: 'Medium Priority', value: 'medium' },
              { label: 'Low Priority', value: 'low' },
            ]}
            className="w-40"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsChart
            title="Current Skills vs Market Demand by Category"
            subtitle="Blue: Your verified & listed skills · Dark Slate: Distinct skills demanded by active roles"
            type="bar"
            data={categoryComparisonData}
            dataKey="Yours"
            secondaryDataKey="Market"
            nameKey="category"
            height={280}
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#0F172A] font-display">
              Gap Summary
            </h3>
            <div className="mt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">High Priority Gaps</span>
                <span className="font-mono-tabular font-semibold text-rose-700">
                  {aggregatedGaps.filter((g) => g.priority === 'high').length}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Medium Priority Gaps</span>
                <span className="font-mono-tabular font-semibold text-amber-700">
                  {aggregatedGaps.filter((g) => g.priority === 'medium').length}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Low Priority Gaps</span>
                <span className="font-mono-tabular font-semibold text-slate-700">
                  {aggregatedGaps.filter((g) => g.priority === 'low').length}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-600">Current Verified Skills</span>
                <span className="font-mono-tabular font-semibold text-emerald-700">
                  {
                    activeStudent.skills.filter(
                      (s) => s.evidenceType !== 'resume_mentioned'
                    ).length
                  }
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/student/roadmap')}
            className="mt-6 w-full py-2.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg cursor-pointer"
          >
            Open Personalized Learning Roadmap
          </button>
        </div>
      </div>

      {/* Gap Cards */}
      <div className="mt-6">
        <h3 className="text-base font-semibold text-[#0F172A] font-display mb-3">
          Identified Skill Gaps ({aggregatedGaps.length})
        </h3>
        {aggregatedGaps.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
            <p className="text-sm font-medium text-[#0F172A]">
              No skill gaps found for this selection
            </p>
            <p className="text-xs text-slate-500 mt-1">
              You meet all required technical competencies for the selected criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {aggregatedGaps.map((gap) => (
              <SkillGapCard
                key={gap.skillName}
                skillName={gap.skillName}
                category={gap.category}
                priority={gap.priority}
                weight={gap.avgWeight}
                affectedJobs={gap.jobs}
                onStartLearning={handleStartLearning}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
