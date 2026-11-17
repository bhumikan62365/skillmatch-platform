import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, AlertTriangle, Award, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DashboardLayout } from '../../components/ui/DashboardLayout';
import { StatCard } from '../../components/ui/StatCard';
import { AnalyticsChart } from '../../components/ui/AnalyticsChart';
import {
  calculateEmployabilityScore,
  calculateJobMatch,
} from '../../services/matchingEngine';

export function PlacementDashboard() {
  const { students, jobs } = useApp();
  const navigate = useNavigate();

  const metrics = useMemo(() => {
    const ready = students.filter(
      (s) =>
        s.placementStatus === 'Placement Ready' || s.placementStatus === 'Selected'
    ).length;
    const training = students.filter(
      (s) => s.placementStatus === 'Requires Training'
    ).length;
    const placed = students.filter((s) => s.placementStatus === 'Selected').length;

    const avgMatch =
      students.length > 0 && jobs.length > 0
        ? Math.round(
            students.reduce((acc, stu) => {
              const best = Math.max(
                ...jobs.map((j) => calculateJobMatch(stu, j).matchScore)
              );
              return acc + best;
            }, 0) / students.length
          )
        : 0;

    return {
      total: students.length,
      ready,
      training,
      placed,
      avgMatch,
    };
  }, [students, jobs]);

  const deptDistribution = useMemo(() => {
    const map = new Map<string, { totalScore: number; count: number }>();
    students.forEach((s) => {
      const score = calculateEmployabilityScore(s, jobs);
      const curr = map.get(s.department) || { totalScore: 0, count: 0 };
      map.set(s.department, {
        totalScore: curr.totalScore + score,
        count: curr.count + 1,
      });
    });
    return Array.from(map.entries()).map(([dept, val]) => ({
      department: dept,
      avgScore: Math.round(val.totalScore / val.count),
      students: val.count,
    }));
  }, [students, jobs]);

  const readinessDonut = useMemo(() => {
    const statuses = [
      'Placement Ready',
      'Selected',
      'In Process',
      'Requires Training',
    ] as const;
    return statuses
      .map((status) => ({
        status,
        count: students.filter((s) => s.placementStatus === status).length,
      }))
      .filter((x) => x.count > 0);
  }, [students]);

  const commonMissingSkills = useMemo(() => {
    const counts = new Map<string, number>();
    students.forEach((stu) => {
      const missingSet = new Set<string>();
      jobs.forEach((job) => {
        calculateJobMatch(stu, job).missingRequiredSkills.forEach((m) =>
          missingSet.add(m.name)
        );
      });
      missingSet.forEach((skill) => {
        counts.set(skill, (counts.get(skill) || 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .map(([skill, missingCount]) => ({ skill, missingCount }))
      .sort((a, b) => b.missingCount - a.missingCount)
      .slice(0, 6);
  }, [students, jobs]);

  return (
    <DashboardLayout
      title="Placement Dashboard"
      breadcrumb="Placement Cell / Institutional Overview"
    >
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Institutional Employability Intelligence · Average Top Match Score:{' '}
            <span className="font-mono-tabular font-semibold text-[#2563EB]">
              {metrics.avgMatch}%
            </span>
          </p>
          <h2 className="mt-1 text-xl font-bold text-[#0F172A] font-display">
            Cohort Placement Readiness Overview
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/placement/jobs')}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg whitespace-nowrap cursor-pointer"
          >
            Manage Jobs
          </button>
          <button
            type="button"
            onClick={() => navigate('/placement/reports')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg whitespace-nowrap cursor-pointer"
          >
            <span>Generate Reports</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
        <StatCard
          label="Total Registered Students"
          value={metrics.total}
          hint="Across 4 engineering departments"
          icon={Users}
          tone="slate"
          onClick={() => navigate('/placement/students')}
        />
        <StatCard
          label="Placement-Ready Students"
          value={metrics.ready}
          hint={`${Math.round((metrics.ready / Math.max(1, metrics.total)) * 100)}% of cohort`}
          icon={UserCheck}
          tone="blue"
          onClick={() => navigate('/placement/tracking')}
        />
        <StatCard
          label="Requiring Upskilling"
          value={metrics.training}
          hint="Prioritized for skill workshops"
          icon={AlertTriangle}
          tone="amber"
          onClick={() => navigate('/placement/skill-gaps')}
        />
        <StatCard
          label="Total Placed Students"
          value={metrics.placed}
          hint={`Avg match score ${metrics.avgMatch}%`}
          icon={Award}
          tone="emerald"
          onClick={() => navigate('/placement/tracking')}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <AnalyticsChart
            title="Department-wise Average Employability Score (%)"
            subtitle="Computed from verified project skills, resume inventory, and job demand weights"
            type="bar"
            data={deptDistribution}
            dataKey="avgScore"
            nameKey="department"
            height={270}
          />
        </div>

        <AnalyticsChart
          title="Cohort Placement Readiness Breakdown"
          subtitle="Distribution by current placement status"
          type="donut"
          data={readinessDonut}
          dataKey="count"
          nameKey="status"
          height={270}
        />
      </div>

      {/* Common Missing Skills & Quick Readiness List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <AnalyticsChart
          title="Most Common Missing Technical Skills"
          subtitle="Number of students missing each required industry competency"
          type="horizontal_bar"
          data={commonMissingSkills}
          dataKey="missingCount"
          nameKey="skill"
          height={250}
        />

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#0F172A] font-display">
                Students Requiring Priority Attention
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Lowest employability alignment with active drives
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/placement/students')}
              className="text-xs font-medium text-[#2563EB] hover:text-blue-700 cursor-pointer"
            >
              Open Directory
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {students
              .filter(
                (s) =>
                  s.placementStatus === 'Requires Training' ||
                  s.placementStatus === 'In Process'
              )
              .slice(0, 4)
              .map((stu) => {
                const score = calculateEmployabilityScore(stu, jobs);
                return (
                  <div
                    key={stu.id}
                    className="py-3 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">
                        {stu.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        <span className="font-mono-tabular">{stu.usn}</span> ·{' '}
                        {stu.department}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-mono-tabular font-semibold text-amber-700">
                        {score}%
                      </span>
                      <p className="text-[11px] text-slate-500">
                        {stu.placementStatus}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
