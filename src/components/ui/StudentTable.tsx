import React, { useMemo, useState } from 'react';
import { ArrowUpDown, Eye } from 'lucide-react';
import { JobListing, StudentRecord } from '../../types';
import { calculateEmployabilityScore } from '../../services/matchingEngine';

interface StudentTableProps {
  students: StudentRecord[];
  jobs: JobListing[];
  onViewStudent: (student: StudentRecord) => void;
  pageSize?: number;
}

type SortKey = 'name' | 'cgpa' | 'score' | 'graduationYear';

export function StudentTable({
  students,
  jobs,
  onViewStudent,
  pageSize = 6,
}: StudentTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);

  const enriched = useMemo(() => {
    return students.map((student) => ({
      student,
      score: calculateEmployabilityScore(student, jobs),
    }));
  }, [students, jobs]);

  const sorted = useMemo(() => {
    return [...enriched].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') cmp = a.student.name.localeCompare(b.student.name);
      else if (sortKey === 'cgpa') cmp = a.student.cgpa - b.student.cgpa;
      else if (sortKey === 'graduationYear')
        cmp = a.student.graduationYear - b.student.graduationYear;
      else cmp = a.score - b.score;
      return sortAsc ? cmp : -cmp;
    });
  }, [enriched, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(false);
    }
    setPage(1);
  };

  if (students.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
        <p className="text-sm font-medium text-[#0F172A]">No matching students</p>
        <p className="text-xs text-slate-500 mt-1">
          Try clearing filters or broadening your search query.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
              <th className="py-3 px-4">
                <button
                  type="button"
                  onClick={() => toggleSort('name')}
                  className="inline-flex items-center gap-1 hover:text-[#0F172A] cursor-pointer"
                >
                  Student & USN
                  <ArrowUpDown className="w-3 h-3" aria-hidden="true" />
                </button>
              </th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4 text-right">
                <button
                  type="button"
                  onClick={() => toggleSort('graduationYear')}
                  className="inline-flex items-center gap-1 hover:text-[#0F172A] cursor-pointer"
                >
                  Batch
                  <ArrowUpDown className="w-3 h-3" aria-hidden="true" />
                </button>
              </th>
              <th className="py-3 px-4 text-right">
                <button
                  type="button"
                  onClick={() => toggleSort('cgpa')}
                  className="inline-flex items-center gap-1 hover:text-[#0F172A] cursor-pointer"
                >
                  CGPA
                  <ArrowUpDown className="w-3 h-3" aria-hidden="true" />
                </button>
              </th>
              <th className="py-3 px-4">Top Skills</th>
              <th className="py-3 px-4 text-right">
                <button
                  type="button"
                  onClick={() => toggleSort('score')}
                  className="inline-flex items-center gap-1 hover:text-[#0F172A] cursor-pointer"
                >
                  Employability
                  <ArrowUpDown className="w-3 h-3" aria-hidden="true" />
                </button>
              </th>
              <th className="py-3 px-4">Placement Status</th>
              <th className="py-3 px-4 text-right">Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {paged.map(({ student, score }) => {
              const statusCls =
                student.placementStatus === 'Selected'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : student.placementStatus === 'Placement Ready'
                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                  : student.placementStatus === 'In Process'
                  ? 'bg-slate-100 text-slate-700 border-slate-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200';

              return (
                <tr
                  key={student.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-[#0F172A]">{student.name}</div>
                    <div className="text-xs text-slate-500 font-mono-tabular">
                      {student.usn}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-700">
                    {student.department}
                  </td>
                  <td className="py-3 px-4 text-right text-xs font-mono-tabular text-slate-700">
                    {student.graduationYear}
                  </td>
                  <td className="py-3 px-4 text-right text-xs font-mono-tabular font-medium text-[#0F172A]">
                    {student.cgpa.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600 max-w-[200px] truncate">
                    {student.skills.slice(0, 3).map((s) => s.name).join(' · ') || 'None added'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-tabular font-semibold text-[#2563EB]">
                    {score}%
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block text-xs font-medium px-2 py-0.5 rounded-md border whitespace-nowrap ${statusCls}`}
                    >
                      {student.placementStatus}
                      {student.placedCompany ? ` · ${student.placedCompany}` : ''}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onViewStudent(student)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#2563EB] hover:text-blue-700 whitespace-nowrap cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="tabular-nums">
            Showing {(safePage - 1) * pageSize + 1}–
            {Math.min(safePage * pageSize, sorted.length)} of {sorted.length} students
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>
            <span className="font-mono-tabular">
              {safePage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
