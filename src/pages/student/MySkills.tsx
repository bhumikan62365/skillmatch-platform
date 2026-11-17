import React, { useMemo, useState } from 'react';
import { Plus, CheckCircle2, FileText, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DashboardLayout } from '../../components/ui/DashboardLayout';
import { Modal } from '../../components/ui/Modal';
import { SearchBar } from '../../components/ui/SearchBar';
import { SkillCategory, SkillEvidenceType, SkillItem } from '../../types';

const SKILL_CATEGORIES: SkillCategory[] = [
  'Programming Languages',
  'Web Development',
  'Database Technologies',
  'AI/ML',
  'Development Tools',
  'Core Computer Science',
];

export function MySkills() {
  const { activeStudent, addOrUpdateSkill, deleteSkill } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState<{
    name: string;
    category: SkillCategory;
    proficiency: SkillItem['proficiency'];
    evidenceType: SkillEvidenceType;
    evidenceSource: string;
  }>({
    name: '',
    category: 'Programming Languages',
    proficiency: 'Intermediate',
    evidenceType: 'project_verified',
    evidenceSource: '',
  });

  const filtered = useMemo(() => {
    return activeStudent.skills.filter((sk) => {
      const matchQuery = sk.name.toLowerCase().includes(search.toLowerCase());
      const matchCat =
        selectedCategory === 'All' || sk.category === selectedCategory;
      return matchQuery && matchCat;
    });
  }, [activeStudent.skills, search, selectedCategory]);

  const grouped = useMemo(() => {
    return SKILL_CATEGORIES.map((category) => ({
      category,
      items: filtered.filter((s) => s.category === category),
    })).filter((g) => g.items.length > 0);
  }, [filtered]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addOrUpdateSkill({
      name: form.name.trim(),
      category: form.category,
      proficiency: form.proficiency,
      evidenceType: form.evidenceType,
      evidenceSource:
        form.evidenceSource.trim() ||
        (form.evidenceType === 'resume_mentioned'
          ? 'Self-reported / Resume'
          : 'Verified project repository'),
      verified: form.evidenceType !== 'resume_mentioned',
    });
    setForm({
      name: '',
      category: 'Programming Languages',
      proficiency: 'Intermediate',
      evidenceType: 'project_verified',
      evidenceSource: '',
    });
    setModalOpen(false);
  };

  const verifiedCount = activeStudent.skills.filter(
    (s) => s.evidenceType !== 'resume_mentioned'
  ).length;

  return (
    <DashboardLayout title="My Skills" breadcrumb="Student Portal / My Skills">
      {/* Top Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#0F172A] font-display">
            Categorized Technical Inventory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
            {activeStudent.skills.length} total skills · {verifiedCount} backed by practical evidence ·{' '}
            {activeStudent.skills.length - verifiedCount} resume-mentioned only
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Filter skills..."
            className="w-full sm:w-56"
          />
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1">
        {['All', ...SKILL_CATEGORIES].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#0F172A] text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-[#0F172A]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grouped Skill Tables */}
      {grouped.length === 0 ? (
        <div className="mt-6 bg-white border border-slate-200 rounded-xl p-10 text-center">
          <p className="text-sm font-medium text-[#0F172A]">No skills found</p>
          <p className="text-xs text-slate-500 mt-1">
            Add a skill or upload your resume to populate your technical profile.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {grouped.map((group) => (
            <div
              key={group.category}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-[#0F172A] font-display">
                  {group.category}
                </h3>
                <span className="text-xs font-mono-tabular text-slate-500">
                  {group.items.length}
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {group.items.map((sk) => (
                  <div
                    key={sk.id}
                    className="py-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#0F172A]">
                          {sk.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          · {sk.proficiency}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-xs">
                        {sk.evidenceType === 'resume_mentioned' ? (
                          <>
                            <FileText className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                            <span className="text-blue-700">
                              Resume Mentioned ({sk.evidenceSource})
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="text-emerald-700 truncate">
                              Verified Evidence ({sk.evidenceSource})
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteSkill(sk.id)}
                      aria-label={`Delete ${sk.name}`}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Technical Skill"
        subtitle="Categorize the skill and specify verification evidence."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Skill Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Kubernetes, GraphQL, PyTorch"
              className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as SkillCategory })
                }
                className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg bg-white"
              >
                {SKILL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Proficiency
              </label>
              <select
                value={form.proficiency}
                onChange={(e) =>
                  setForm({
                    ...form,
                    proficiency: e.target.value as SkillItem['proficiency'],
                  })
                }
                className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Verification Evidence Type
            </label>
            <select
              value={form.evidenceType}
              onChange={(e) =>
                setForm({
                  ...form,
                  evidenceType: e.target.value as SkillEvidenceType,
                })
              }
              className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg bg-white"
            >
              <option value="project_verified">Practical Project Evidence</option>
              <option value="certification_verified">
                Certification / Academic Credential
              </option>
              <option value="resume_mentioned">Resume Mentioned Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Evidence Source
            </label>
            <input
              type="text"
              value={form.evidenceSource}
              onChange={(e) =>
                setForm({ ...form, evidenceSource: e.target.value })
              }
              placeholder="e.g. Project: Distributed Exam Proctor Portal"
              className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg"
            />
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
              Save Skill
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
