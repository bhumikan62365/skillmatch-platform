import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardLayout } from '../../components/ui/DashboardLayout';
import { FilterDropdown } from '../../components/ui/FilterDropdown';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { calculateJobMatch } from '../../services/matchingEngine';

export function SkillGapReports() {
  const { students, jobs } = useApp();
  const [deptFilter, setDeptFilter] = useState('All');

  const departments = useMemo(() => {
    const unique = Array.from(new Set(students.map((s) => s.department)));
    return [
      { label: 'All Departments', value: 'All' },
      ...unique.map((d) => ({ label: d, value: d })),
    ];
  }, [students]);

  const scopedStudents = useMemo(() => {
    if (deptFilter === 'All') return students;
    return students.filter((s) => s.department === deptFilter);
  }, [students, deptFilter]);

  const gapMatrix = useMemo(() => {
    const map = new Map<
      string,
      { skill: string; category: string; missingStudents: number; demandedRoles: number }
    >();

    jobs.forEach((job) => {
      job.requiredSkills.forEach((req) => {
        const entry = map.get(req.name) || {
          skill: req.name,
          category: req.category,
          missingStudents: 0,
          demandedRoles: 0,
        };
        entry.demandedRoles += 1;
        map.set(req.name, entry);
      });
    });

    scopedStudents.forEach((stu) => {
      const missingSet = new Set<string>();
      jobs.forEach((job) => {
        calculateJobMatch(stu, job).missingRequiredSkills.forEach((m) =>
          missingSet.add(m.name)
        );
      });
      missingSet.forEach((sk) => {
        const entry = map.get(sk);
        if (entry) entry.missingStudents += 1;
      });
    });

    return Array.from(map.values())
      .map((item) => ({
        ...item,
        gapPct:
          scopedStudents.length > 0
            ? Math.round((item.missingStudents / scopedStudents.length) * 100)
            : 0,
      }))
      .sort((a, b) => b.gapPct - a.gapPct);
  }, [scopedStudents, jobs]);

  return (
    <DashboardLayout
      title="Skill Gap Reports"
      breadcrumb="Placement Cell / Skill Gap Reports"
    >
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#0F172A] font-display">
            Cohort Skill-Gap Severity Matrix
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
            Analyzing {scopedStudents.length} students against {jobs.length} active industry role profiles
          </p>
        </div>

        <FilterDropdown
          label="Department"
          value={deptFilter}
          onChange={setDeptFilter}
          options={departments}
          className="w-56"
        />
      </div>

      <div className="mt-6 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
              <th className="py-3 px-4">Required Skill</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-right">Demanded Roles</th>
              <th className="py-3 px-4 text-right">Students Missing</th>
              <th className="py-3 px-4 w-56">Cohort Gap (%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {gapMatrix.map((row) => (
              <tr key={row.skill} className="hover:bg-slate-50/70">
                <td className="py-3 px-4 font-medium text-[#0F172A]">
                  {row.skill}
                </td>
                <td className="py-3 px-4 text-xs text-slate-600">
                  {row.category}
                </td>
                <td className="py-3 px-4 text-right font-mono-tabular text-xs text-slate-700">
                  {row.demandedRoles}
                </td>
                <td className="py-3 px-4 text-right font-mono-tabular text-xs text-slate-700">
                  {row.missingStudents} / {scopedStudents.length}
                </td>
                <td className="py-3 px-4">
                  <ProgressBar
                    value={row.gapPct}
                    showValue
                    size="sm"
                    tone={row.gapPct >= 60 ? 'rose' : row.gapPct >= 30 ? 'amber' : 'emerald'}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
