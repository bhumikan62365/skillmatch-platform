import React, { useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DashboardLayout } from '../../components/ui/DashboardLayout';
import { SearchBar } from '../../components/ui/SearchBar';
import { FilterDropdown } from '../../components/ui/FilterDropdown';
import { StudentTable } from '../../components/ui/StudentTable';
import { Modal } from '../../components/ui/Modal';
import { SkillBadge } from '../../components/ui/SkillBadge';
import { StudentRecord } from '../../types';
import { calculateEmployabilityScore } from '../../services/matchingEngine';

export function StudentDirectory() {
  const { students, jobs } = useApp();

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(
    null
  );

  const departments = useMemo(() => {
    const unique = Array.from(new Set(students.map((s) => s.department)));
    return [
      { label: 'All Departments', value: 'All' },
      ...unique.map((d) => ({ label: d, value: d })),
    ];
  }, [students]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((s) => {
      const matchQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.usn.toLowerCase().includes(q) ||
        s.skills.some((sk) => sk.name.toLowerCase().includes(q));
      const matchDept = deptFilter === 'All' || s.department === deptFilter;
      const matchStatus =
        statusFilter === 'All' || s.placementStatus === statusFilter;
      const matchYear =
        yearFilter === 'All' || String(s.graduationYear) === yearFilter;
      return matchQuery && matchDept && matchStatus && matchYear;
    });
  }, [students, search, deptFilter, statusFilter, yearFilter]);

  return (
    <DashboardLayout
      title="Student Directory"
      breadcrumb="Placement Cell / Student Directory"
    >
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#0F172A] font-display">
              Registered Student Profiles
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
              {filtered.length} of {students.length} students matching active criteria
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search name, USN, or skill..."
          />
          <FilterDropdown
            label="Department"
            value={deptFilter}
            onChange={setDeptFilter}
            options={departments}
          />
          <FilterDropdown
            label="Placement Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: 'All Statuses', value: 'All' },
              { label: 'Placement Ready', value: 'Placement Ready' },
              { label: 'Selected', value: 'Selected' },
              { label: 'In Process', value: 'In Process' },
              { label: 'Requires Training', value: 'Requires Training' },
            ]}
          />
          <FilterDropdown
            label="Graduation Year"
            value={yearFilter}
            onChange={setYearFilter}
            options={[
              { label: 'All Batches', value: 'All' },
              { label: '2026', value: '2026' },
              { label: '2027', value: '2027' },
            ]}
          />
        </div>
      </div>

      <StudentTable
        students={filtered}
        jobs={jobs}
        onViewStudent={(stu) => setSelectedStudent(stu)}
      />

      <Modal
        isOpen={Boolean(selectedStudent)}
        onClose={() => setSelectedStudent(null)}
        title={selectedStudent?.name || 'Student Profile'}
        subtitle={
          selectedStudent
            ? `${selectedStudent.usn} · ${selectedStudent.department} · Batch ${selectedStudent.graduationYear}`
            : ''
        }
        maxWidthClass="max-w-2xl"
      >
        {selectedStudent && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-slate-100 text-xs">
              <div>
                <p className="text-slate-500">CGPA</p>
                <p className="font-mono-tabular font-semibold text-sm text-[#0F172A] mt-0.5">
                  {selectedStudent.cgpa.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Employability</p>
                <p className="font-mono-tabular font-semibold text-sm text-[#2563EB] mt-0.5">
                  {calculateEmployabilityScore(selectedStudent, jobs)}%
                </p>
              </div>
              <div>
                <p className="text-slate-500">Status</p>
                <p className="font-semibold text-sm text-[#0F172A] mt-0.5">
                  {selectedStudent.placementStatus}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Applied Roles</p>
                <p className="font-mono-tabular font-semibold text-sm text-[#0F172A] mt-0.5">
                  {selectedStudent.appliedJobIds.length}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-700 mb-2.5">
                Technical Skills & Evidence
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedStudent.skills.map((sk) => (
                  <SkillBadge
                    key={sk.id}
                    name={sk.name}
                    evidenceType={sk.evidenceType}
                  />
                ))}
              </div>
            </div>

            {selectedStudent.projects.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-700 mb-2">
                  Documented Projects
                </h4>
                <div className="space-y-2">
                  {selectedStudent.projects.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-lg border border-slate-200 text-xs"
                    >
                      <p className="font-semibold text-[#0F172A]">{p.title}</p>
                      <p className="text-slate-600 mt-0.5">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 pt-2 text-xs">
              {selectedStudent.githubUrl && (
                <a
                  href={selectedStudent.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[#2563EB] font-medium hover:underline"
                >
                  GitHub <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {selectedStudent.linkedinUrl && (
                <a
                  href={selectedStudent.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[#2563EB] font-medium hover:underline"
                >
                  LinkedIn <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
