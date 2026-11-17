import React, { useState } from 'react';
import {
  Edit3,
  ExternalLink,
  Award,
  Plus,
  Trash2,
  Save,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DashboardLayout } from '../../components/ui/DashboardLayout';
import { SkillBadge } from '../../components/ui/SkillBadge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { calculateProfileCompletion } from '../../services/matchingEngine';

export function StudentProfile() {
  const { activeStudent, updateStudentProfile } = useApp();
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: activeStudent.name,
    phone: activeStudent.phone,
    institution: activeStudent.institution,
    department: activeStudent.department,
    graduationYear: activeStudent.graduationYear,
    cgpa: activeStudent.cgpa,
    headline: activeStudent.headline,
    githubUrl: activeStudent.githubUrl,
    linkedinUrl: activeStudent.linkedinUrl,
  });

  const [certName, setCertName] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certDate, setCertDate] = useState('2026-10');

  const completion = calculateProfileCompletion(activeStudent);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.cgpa < 0 || form.cgpa > 10) return;
    updateStudentProfile({
      ...form,
      cgpa: Number(form.cgpa),
      graduationYear: Number(form.graduationYear),
    });
    setEditing(false);
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certName.trim() || !certIssuer.trim()) return;
    updateStudentProfile({
      certifications: [
        ...activeStudent.certifications,
        {
          id: `cert-${Date.now()}`,
          name: certName.trim(),
          issuer: certIssuer.trim(),
          issueDate: certDate,
        },
      ],
    });
    setCertName('');
    setCertIssuer('');
  };

  const handleRemoveCert = (id: string) => {
    updateStudentProfile({
      certifications: activeStudent.certifications.filter((c) => c.id !== id),
    });
  };

  return (
    <DashboardLayout title="My Profile" breadcrumb="Student Portal / My Profile">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Identity & Links Card */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="flex items-center gap-4">
              {activeStudent.avatarUrl ? (
                <img
                  src={activeStudent.avatarUrl}
                  alt={activeStudent.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-lg">
                  {activeStudent.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-[#0F172A] font-display truncate">
                  {activeStudent.name}
                </h2>
                <p className="text-xs font-mono-tabular text-slate-500">
                  {activeStudent.usn}
                </p>
                <p className="text-xs text-slate-600 mt-0.5 truncate">
                  {activeStudent.department} · Batch {activeStudent.graduationYear}
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-600 leading-relaxed">
              {activeStudent.headline}
            </p>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <ProgressBar
                value={completion}
                label="Profile Completion"
                showValue
                tone="blue"
              />
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">CGPA</span>
                <span className="font-mono-tabular font-semibold text-[#0F172A]">
                  {activeStudent.cgpa.toFixed(2)} / 10.0
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Email</span>
                <span className="text-[#0F172A] truncate max-w-[190px]">
                  {activeStudent.email}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Phone</span>
                <span className="font-mono-tabular text-[#0F172A]">
                  {activeStudent.phone || 'Not provided'}
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2">
              {activeStudent.githubUrl && (
                <a
                  href={activeStudent.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-[#0F172A] hover:bg-slate-50"
                >
                  <span>GitHub Profile</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              )}
              {activeStudent.linkedinUrl && (
                <a
                  href={activeStudent.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-[#0F172A] hover:bg-slate-50"
                >
                  <span>LinkedIn Profile</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Personal & Academic Form + Certifications & Skills */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="text-base font-semibold text-[#0F172A] font-display">
                  Personal & Academic Information
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Used for eligibility checks across placement drives
                </p>
              </div>
              {!editing ? (
                <button
                  type="button"
                  onClick={() => {
                    setForm({
                      name: activeStudent.name,
                      phone: activeStudent.phone,
                      institution: activeStudent.institution,
                      department: activeStudent.department,
                      graduationYear: activeStudent.graduationYear,
                      cgpa: activeStudent.cgpa,
                      headline: activeStudent.headline,
                      githubUrl: activeStudent.githubUrl,
                      linkedinUrl: activeStudent.linkedinUrl,
                    });
                    setEditing(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Cancel</span>
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2563EB]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Institution
                    </label>
                    <input
                      type="text"
                      value={form.institution}
                      onChange={(e) =>
                        setForm({ ...form, institution: e.target.value })
                      }
                      className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2563EB]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Department
                    </label>
                    <select
                      value={form.department}
                      onChange={(e) =>
                        setForm({ ...form, department: e.target.value })
                      }
                      className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#2563EB]"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Science">Information Science</option>
                      <option value="AI & ML">AI & ML</option>
                      <option value="Electronics & Comm.">Electronics & Comm.</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Graduation Year
                    </label>
                    <input
                      type="number"
                      min={2024}
                      max={2030}
                      value={form.graduationYear}
                      onChange={(e) =>
                        setForm({ ...form, graduationYear: Number(e.target.value) })
                      }
                      className="w-full h-10 px-3 text-sm font-mono-tabular border border-slate-200 rounded-lg focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      CGPA (0–10)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      max={10}
                      value={form.cgpa}
                      onChange={(e) =>
                        setForm({ ...form, cgpa: Number(e.target.value) })
                      }
                      className="w-full h-10 px-3 text-sm font-mono-tabular border border-slate-200 rounded-lg focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={form.githubUrl}
                      onChange={(e) =>
                        setForm({ ...form, githubUrl: e.target.value })
                      }
                      className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={form.linkedinUrl}
                      onChange={(e) =>
                        setForm({ ...form, linkedinUrl: e.target.value })
                      }
                      className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Career Headline
                  </label>
                  <input
                    type="text"
                    value={form.headline}
                    onChange={(e) => setForm({ ...form, headline: e.target.value })}
                    className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Institution</p>
                  <p className="font-medium text-[#0F172A] mt-0.5">
                    {activeStudent.institution}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Department</p>
                  <p className="font-medium text-[#0F172A] mt-0.5">
                    {activeStudent.department}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Graduation Year</p>
                  <p className="font-medium font-mono-tabular text-[#0F172A] mt-0.5">
                    {activeStudent.graduationYear}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Cumulative GPA</p>
                  <p className="font-medium font-mono-tabular text-[#0F172A] mt-0.5">
                    {activeStudent.cgpa.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Certifications */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <h3 className="text-base font-semibold text-[#0F172A] font-display mb-4">
              Certifications
            </h3>

            {activeStudent.certifications.length === 0 ? (
              <p className="text-xs text-slate-500 mb-4">
                No certifications added yet. Add verified industry credentials below.
              </p>
            ) : (
              <div className="space-y-2.5 mb-5">
                {activeStudent.certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center justify-between gap-4 p-3 rounded-lg border border-slate-200/80"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Award className="w-4 h-4 text-[#2563EB] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#0F172A] truncate">
                          {cert.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {cert.issuer} · Issued {cert.issueDate}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCert(cert.id)}
                      aria-label={`Remove ${cert.name}`}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form
              onSubmit={handleAddCert}
              className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-4 border-t border-slate-100"
            >
              <input
                type="text"
                value={certName}
                onChange={(e) => setCertName(e.target.value)}
                placeholder="Certification title"
                className="sm:col-span-2 h-9 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#2563EB]"
              />
              <input
                type="text"
                value={certIssuer}
                onChange={(e) => setCertIssuer(e.target.value)}
                placeholder="Issuer (e.g. AWS)"
                className="h-9 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#2563EB]"
              />
              <div className="flex gap-2">
                <input
                  type="month"
                  value={certDate}
                  onChange={(e) => setCertDate(e.target.value)}
                  className="w-full h-9 px-2 text-xs border border-slate-200 rounded-lg"
                />
                <button
                  type="submit"
                  className="px-3 h-9 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-medium rounded-lg inline-flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>
            </form>
          </div>

          {/* Technical Skills Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <h3 className="text-base font-semibold text-[#0F172A] font-display mb-3">
              Verified & Extracted Technical Skills
            </h3>
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
