import React, { useMemo } from 'react';
import { Download, Printer } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DashboardLayout } from '../../components/ui/DashboardLayout';
import { placementService } from '../../services/placementService';
import {
  calculateEmployabilityScore,
  calculateJobMatch,
} from '../../services/matchingEngine';

export function ReportsPage() {
  const { students, jobs, addToast } = useApp();

  const departmentSummary = useMemo(() => {
    const map = new Map<
      string,
      { total: number; placed: number; ready: number; scoreSum: number }
    >();
    students.forEach((s) => {
      const score = calculateEmployabilityScore(s, jobs);
      const curr = map.get(s.department) || {
        total: 0,
        placed: 0,
        ready: 0,
        scoreSum: 0,
      };
      curr.total += 1;
      if (s.placementStatus === 'Selected') curr.placed += 1;
      if (
        s.placementStatus === 'Placement Ready' ||
        s.placementStatus === 'Selected'
      ) {
        curr.ready += 1;
      }
      curr.scoreSum += score;
      map.set(s.department, curr);
    });

    return Array.from(map.entries()).map(([department, d]) => ({
      department,
      total: d.total,
      placed: d.placed,
      ready: d.ready,
      avgScore: Math.round(d.scoreSum / d.total),
    }));
  }, [students, jobs]);

  const gapReportRows = useMemo(() => {
    const counts = new Map<string, { category: string; missing: number }>();
    students.forEach((stu) => {
      const missingSet = new Set<string>();
      jobs.forEach((job) => {
        calculateJobMatch(stu, job).missingRequiredSkills.forEach((m) => {
          if (!missingSet.has(m.name)) {
            missingSet.add(m.name);
            const curr = counts.get(m.name) || {
              category: m.category,
              missing: 0,
            };
            curr.missing += 1;
            counts.set(m.name, curr);
          }
        });
      });
    });

    return Array.from(counts.entries())
      .map(([skill, val]) => ({
        skill,
        category: val.category,
        missingCount: val.missing,
        percentage:
          students.length > 0
            ? Math.round((val.missing / students.length) * 100)
            : 0,
      }))
      .sort((a, b) => b.missingCount - a.missingCount);
  }, [students, jobs]);

  const handleExportStudents = () => {
    placementService.exportStudentsCSV(students, jobs);
    addToast({
      type: 'success',
      title: 'CSV Exported',
      message: 'Student employability report downloaded.',
    });
  };

  const handleExportGaps = () => {
    placementService.exportSkillGapCSV(gapReportRows);
    addToast({
      type: 'success',
      title: 'CSV Exported',
      message: 'Institutional skill-gap report downloaded.',
    });
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <DashboardLayout title="Reports" breadcrumb="Placement Cell / Reports">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-base font-semibold text-[#0F172A] font-display">
            Institutional Analytics & Export Center
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Download department-wise employability reports, skill-gap summaries, and printable PDF briefs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleExportStudents}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export Student CSV
          </button>
          <button
            type="button"
            onClick={handleExportGaps}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#0F172A] bg-slate-100 hover:bg-slate-200 rounded-lg whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export Skill-Gap CSV
          </button>
          <button
            type="button"
            onClick={handlePrintPDF}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#0F172A] border border-slate-200 hover:bg-slate-50 rounded-lg whitespace-nowrap cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Department-Wise Report */}
      <div className="mt-6 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-[#0F172A] font-display">
            Department-Wise Placement & Readiness Statistics
          </h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4 text-right">Students</th>
              <th className="py-3 px-4 text-right">Placement Ready</th>
              <th className="py-3 px-4 text-right">Placed</th>
              <th className="py-3 px-4 text-right">Avg Employability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {departmentSummary.map((row) => (
              <tr key={row.department}>
                <td className="py-3 px-4 font-medium text-[#0F172A]">
                  {row.department}
                </td>
                <td className="py-3 px-4 text-right font-mono-tabular text-xs">
                  {row.total}
                </td>
                <td className="py-3 px-4 text-right font-mono-tabular text-xs">
                  {row.ready}
                </td>
                <td className="py-3 px-4 text-right font-mono-tabular text-xs text-emerald-700 font-semibold">
                  {row.placed}
                </td>
                <td className="py-3 px-4 text-right font-mono-tabular text-xs font-semibold text-[#2563EB]">
                  {row.avgScore}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Skill-Gap Report */}
      <div className="mt-6 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-[#0F172A] font-display">
            Cohort Skill-Gap Summary
          </h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
              <th className="py-3 px-4">Skill</th>
              <th className="py-3 px-4">Domain</th>
              <th className="py-3 px-4 text-right">Students Missing</th>
              <th className="py-3 px-4 text-right">Gap Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {gapReportRows.map((row) => (
              <tr key={row.skill}>
                <td className="py-3 px-4 font-medium text-[#0F172A]">
                  {row.skill}
                </td>
                <td className="py-3 px-4 text-xs text-slate-600">
                  {row.category}
                </td>
                <td className="py-3 px-4 text-right font-mono-tabular text-xs">
                  {row.missingCount}
                </td>
                <td className="py-3 px-4 text-right font-mono-tabular text-xs font-semibold text-rose-700">
                  {row.percentage}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
