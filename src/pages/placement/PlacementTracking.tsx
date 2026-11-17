import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardLayout } from '../../components/ui/DashboardLayout';
import { StatCard } from '../../components/ui/StatCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Modal } from '../../components/ui/Modal';
import { Users, Award, UserCheck, AlertTriangle } from 'lucide-react';
import { PlacementStatus, StudentRecord } from '../../types';
import { calculateEmployabilityScore } from '../../services/matchingEngine';

export function PlacementTracking() {
  const { students, jobs, updateStudentPlacement } = useApp();
  const [tab, setTab] = useState<'all' | 'eligible' | 'selected' | 'unplaced'>('all');
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [statusInput, setStatusInput] = useState<PlacementStatus>('Placement Ready');
  const [companyInput, setCompanyInput] = useState('');

  const eligibleStudents = students.filter((s) => s.cgpa >= 7.5);
  const selectedStudents = students.filter((s) => s.placementStatus === 'Selected');
  const unplacedStudents = students.filter((s) => s.placementStatus !== 'Selected');

  const visibleStudents = useMemo(() => {
    if (tab === 'eligible') return eligibleStudents;
    if (tab === 'selected') return selectedStudents;
    if (tab === 'unplaced') return unplacedStudents;
    return students;
  }, [tab, students, eligibleStudents, selectedStudents, unplacedStudents]);

  const placementRate =
    students.length > 0
      ? Math.round((selectedStudents.length / students.length) * 100)
      : 0;

  const openUpdate = (stu: StudentRecord) => {
    setEditingStudent(stu);
    setStatusInput(stu.placementStatus);
    setCompanyInput(stu.placedCompany || '');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    updateStudentPlacement(editingStudent.id, statusInput, companyInput.trim());
    setEditingStudent(null);
  };

  return (
    <DashboardLayout
      title="Placement Tracking"
      breadcrumb="Placement Cell / Placement Tracking"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Cohort"
          value={students.length}
          icon={Users}
          tone="slate"
        />
        <StatCard
          label="Eligible (CGPA ≥ 7.5)"
          value={eligibleStudents.length}
          icon={UserCheck}
          tone="blue"
        />
        <StatCard
          label="Selected / Placed"
          value={selectedStudents.length}
          icon={Award}
          tone="emerald"
        />
        <StatCard
          label="Unplaced Remaining"
          value={unplacedStudents.length}
          icon={AlertTriangle}
          tone="amber"
        />
      </div>

      <div className="mt-6 bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-semibold text-[#0F172A] font-display">
              Season Placement Progress
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
              {selectedStudents.length} of {students.length} students placed ({placementRate}%)
            </p>
          </div>
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
            {(
              [
                { label: 'All Students', value: 'all' },
                { label: 'Eligible', value: 'eligible' },
                { label: 'Selected', value: 'selected' },
                { label: 'Unplaced', value: 'unplaced' },
              ] as const
            ).map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setTab(item.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer ${
                  tab === item.value
                    ? 'bg-white text-[#0F172A] shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <ProgressBar
          value={selectedStudents.length}
          max={Math.max(1, students.length)}
          tone="emerald"
          showValue
          label="Overall Placement Conversion"
        />

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">Student & USN</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-right">CGPA</th>
                <th className="py-3 px-4 text-right">Employability</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {visibleStudents.map((stu) => (
                <tr key={stu.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4">
                    <div className="font-medium text-[#0F172A]">{stu.name}</div>
                    <div className="text-xs font-mono-tabular text-slate-500">
                      {stu.usn}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600">
                    {stu.department}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-tabular text-xs">
                    {stu.cgpa.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-tabular text-xs font-semibold text-[#2563EB]">
                    {calculateEmployabilityScore(stu, jobs)}%
                  </td>
                  <td className="py-3 px-4 text-xs">
                    <span className="font-medium text-[#0F172A]">
                      {stu.placementStatus}
                    </span>
                    {stu.placedCompany && (
                      <span className="text-emerald-700">
                        {' '}
                        · {stu.placedCompany}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => openUpdate(stu)}
                      className="text-xs font-medium text-[#2563EB] hover:text-blue-700 cursor-pointer"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={Boolean(editingStudent)}
        onClose={() => setEditingStudent(null)}
        title={`Update Status — ${editingStudent?.name}`}
        subtitle={editingStudent?.usn}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Placement Status
            </label>
            <select
              value={statusInput}
              onChange={(e) => setStatusInput(e.target.value as PlacementStatus)}
              className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg bg-white"
            >
              <option value="Placement Ready">Placement Ready</option>
              <option value="In Process">In Process</option>
              <option value="Requires Training">Requires Training</option>
              <option value="Selected">Selected</option>
            </select>
          </div>

          {statusInput === 'Selected' && (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Placed Company Name
              </label>
              <input
                type="text"
                value={companyInput}
                onChange={(e) => setCompanyInput(e.target.value)}
                placeholder="e.g. Atlassian, Razorpay"
                className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg"
                required
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingStudent(null)}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg cursor-pointer"
            >
              Save Status
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
