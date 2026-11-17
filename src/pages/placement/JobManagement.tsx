import React, { useState } from 'react';
import { Plus, Edit3, Trash2, MapPin, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DashboardLayout } from '../../components/ui/DashboardLayout';
import { Modal } from '../../components/ui/Modal';
import { SearchBar } from '../../components/ui/SearchBar';
import { JobListing, JobType, SkillCategory, WeightedSkill } from '../../types';

export function JobManagement() {
  const { jobs, addJob, updateJob, deleteJob, currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobListing | null>(null);

  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState<JobType>('Full-Time');
  const [salaryRange, setSalaryRange] = useState('');
  const [description, setDescription] = useState('');
  const [requiredInput, setRequiredInput] = useState(
    'TypeScript:9, React:9, PostgreSQL:7'
  );
  const [preferredInput, setPreferredInput] = useState('Docker, Redis');
  const [minCgpa, setMinCgpa] = useState(7.5);
  const [departmentsInput, setDepartmentsInput] = useState(
    'Computer Science, Information Science, AI & ML'
  );
  const [applicationUrl, setApplicationUrl] = useState('https://');
  const [expiryDate, setExpiryDate] = useState('2026-12-30');

  const openCreate = () => {
    setEditingJob(null);
    setCompany('');
    setTitle('');
    setLocation('Bengaluru, India');
    setJobType('Full-Time');
    setSalaryRange('14 – 18 LPA');
    setDescription('');
    setRequiredInput('Python:9, FastAPI:8, PostgreSQL:7, Docker:6');
    setPreferredInput('Kubernetes, Redis');
    setMinCgpa(7.5);
    setDepartmentsInput('Computer Science, Information Science, AI & ML');
    setApplicationUrl('https://careers.company.example');
    setExpiryDate('2026-12-30');
    setModalOpen(true);
  };

  const openEdit = (job: JobListing) => {
    setEditingJob(job);
    setCompany(job.company);
    setTitle(job.title);
    setLocation(job.location);
    setJobType(job.jobType);
    setSalaryRange(job.salaryRange);
    setDescription(job.description);
    setRequiredInput(
      job.requiredSkills.map((s) => `${s.name}:${s.weight}`).join(', ')
    );
    setPreferredInput(job.preferredSkills.join(', '));
    setMinCgpa(job.minCgpa);
    setDepartmentsInput(job.eligibleDepartments.join(', '));
    setApplicationUrl(job.applicationUrl);
    setExpiryDate(job.expiryDate);
    setModalOpen(true);
  };

  const parseWeightedSkills = (raw: string): WeightedSkill[] => {
    return raw
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const [namePart, weightPart] = part.split(':');
        const name = namePart.trim();
        const weight = Math.min(10, Math.max(1, Number(weightPart) || 7));
        const category: SkillCategory =
          name.toLowerCase().includes('python') ||
          name.toLowerCase().includes('typescript') ||
          name.toLowerCase().includes('java')
            ? 'Programming Languages'
            : name.toLowerCase().includes('sql')
            ? 'Database Technologies'
            : name.toLowerCase().includes('torch') ||
              name.toLowerCase().includes('learn')
            ? 'AI/ML'
            : name.toLowerCase().includes('docker') ||
              name.toLowerCase().includes('kuber')
            ? 'Development Tools'
            : name.toLowerCase().includes('design') ||
              name.toLowerCase().includes('algorithm')
            ? 'Core Computer Science'
            : 'Web Development';

        return { name, weight, category };
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !title.trim()) return;

    const payload = {
      company: company.trim(),
      title: title.trim(),
      location: location.trim(),
      jobType,
      salaryRange: salaryRange.trim(),
      description: description.trim(),
      requiredSkills: parseWeightedSkills(requiredInput),
      preferredSkills: preferredInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      minCgpa: Number(minCgpa),
      eligibleDepartments: departmentsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      applicationUrl: applicationUrl.trim(),
      expiryDate,
    };

    if (editingJob) {
      updateJob({
        ...editingJob,
        ...payload,
      });
    } else {
      addJob(payload);
    }
    setModalOpen(false);
  };

  const filtered = jobs.filter(
    (j) =>
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.title.toLowerCase().includes(search.toLowerCase())
  );

  const breadcrumbPrefix =
    currentUser?.role === 'admin' ? 'Platform Admin' : 'Placement Cell';

  return (
    <DashboardLayout
      title="Job Management"
      breadcrumb={`${breadcrumbPrefix} / Job Management`}
    >
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#0F172A] font-display">
            Active Industry Requisitions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Define required skill weights (1–10) and eligibility criteria. Changes sync immediately to student matching.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search company or role..."
            className="w-56"
          />
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Job Listing</span>
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {filtered.map((job) => (
          <div
            key={job.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <div className="space-y-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-[#2563EB]">
                  {job.company}
                </span>
                <span>·</span>
                <span>{job.jobType}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {job.location}
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1 font-mono-tabular">
                  <Calendar className="w-3.5 h-3.5" />
                  Expires {job.expiryDate}
                </span>
              </div>

              <h3 className="text-base font-semibold text-[#0F172A] font-display">
                {job.title}
              </h3>

              <p className="text-xs text-slate-600">
                Min CGPA{' '}
                <span className="font-mono-tabular font-semibold">
                  {job.minCgpa.toFixed(1)}
                </span>{' '}
                · Eligible: {job.eligibleDepartments.join(', ')} ·{' '}
                <span className="font-mono-tabular">
                  {job.applicantsCount} applicants
                </span>
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {job.requiredSkills.map((sk) => (
                  <span
                    key={sk.name}
                    className="px-2 py-0.5 rounded bg-slate-100 text-xs font-medium text-slate-700"
                  >
                    {sk.name}{' '}
                    <span className="font-mono-tabular text-slate-500">
                      w{sk.weight}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => openEdit(job)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => deleteJob(job.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingJob ? 'Edit Job Listing' : 'Create Job Listing'}
        subtitle="Configure weighted technical requirements and eligibility rules."
        maxWidthClass="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value as JobType)}
                className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg bg-white"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Internship">Internship</option>
                <option value="Graduate Trainee">Graduate Trainee</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Compensation / Stipend
              </label>
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Job Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 text-sm border border-slate-200 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Required Skills & Weights (Skill:Weight 1-10, comma-separated)
            </label>
            <input
              type="text"
              value={requiredInput}
              onChange={(e) => setRequiredInput(e.target.value)}
              className="w-full h-10 px-3 text-sm font-mono-tabular border border-slate-200 rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Preferred Skills (comma-separated)
              </label>
              <input
                type="text"
                value={preferredInput}
                onChange={(e) => setPreferredInput(e.target.value)}
                className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Minimum CGPA
              </label>
              <input
                type="number"
                step="0.1"
                min={0}
                max={10}
                value={minCgpa}
                onChange={(e) => setMinCgpa(Number(e.target.value))}
                className="w-full h-10 px-3 text-sm font-mono-tabular border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Eligible Departments
              </label>
              <input
                type="text"
                value={departmentsInput}
                onChange={(e) => setDepartmentsInput(e.target.value)}
                className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Application URL
              </label>
              <input
                type="url"
                value={applicationUrl}
                onChange={(e) => setApplicationUrl(e.target.value)}
                className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg"
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
              {editingJob ? 'Update Job' : 'Publish Job'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
