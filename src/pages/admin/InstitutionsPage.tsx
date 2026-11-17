import React, { useState } from 'react';
import { Plus, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DashboardLayout } from '../../components/ui/DashboardLayout';
import { Modal } from '../../components/ui/Modal';

export function InstitutionsPage() {
  const { institutions, addInstitution, updateInstitutionStatus } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [city, setCity] = useState('');
  const [studentCount, setStudentCount] = useState(500);
  const [officerCount, setOfficerCount] = useState(3);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;
    addInstitution({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      city: city.trim(),
      studentCount: Number(studentCount),
      officerCount: Number(officerCount),
      activeDrives: 0,
      status: 'Active',
    });
    setName('');
    setCode('');
    setCity('');
    setModalOpen(false);
  };

  return (
    <DashboardLayout
      title="Institutions"
      breadcrumb="Platform Admin / Institution Management"
    >
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#0F172A] font-display">
            Partner Universities & Campuses
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Onboard engineering colleges and manage active placement cell instances.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Institution</span>
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        {institutions.map((inst) => (
          <div
            key={inst.id}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between gap-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#0F172A] font-display">
                    {inst.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    <span className="font-mono-tabular">{inst.code}</span> ·{' '}
                    {inst.city}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  updateInstitutionStatus(
                    inst.id,
                    inst.status === 'Active' ? 'Onboarding' : 'Active'
                  )
                }
                className={`px-2.5 py-1 text-xs font-medium rounded-md border cursor-pointer ${
                  inst.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {inst.status}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div>
                <p className="text-slate-500">Students</p>
                <p className="font-mono-tabular font-semibold text-sm text-[#0F172A] mt-0.5">
                  {inst.studentCount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Officers</p>
                <p className="font-mono-tabular font-semibold text-sm text-[#0F172A] mt-0.5">
                  {inst.officerCount}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Active Drives</p>
                <p className="font-mono-tabular font-semibold text-sm text-[#2563EB] mt-0.5">
                  {inst.activeDrives}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Register Partner Institution"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Institution Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Campus Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. MSRIT-BLR"
                className="w-full h-10 px-3 text-sm font-mono-tabular border border-slate-200 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Student Seat Quota
              </label>
              <input
                type="number"
                value={studentCount}
                onChange={(e) => setStudentCount(Number(e.target.value))}
                className="w-full h-10 px-3 text-sm font-mono-tabular border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Placement Officers
              </label>
              <input
                type="number"
                value={officerCount}
                onChange={(e) => setOfficerCount(Number(e.target.value))}
                className="w-full h-10 px-3 text-sm font-mono-tabular border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg cursor-pointer"
            >
              Add Institution
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
