import React, { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DashboardLayout } from '../../components/ui/DashboardLayout';
import { SearchBar } from '../../components/ui/SearchBar';
import { Modal } from '../../components/ui/Modal';
import { SkillCategory, SkillTaxonomyItem } from '../../types';

const CATEGORIES: SkillCategory[] = [
  'Programming Languages',
  'Web Development',
  'Database Technologies',
  'AI/ML',
  'Development Tools',
  'Core Computer Science',
];

export function SkillTaxonomyPage() {
  const { taxonomy, addTaxonomySkill, deleteTaxonomySkill } = useApp();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<SkillCategory>('Programming Languages');
  const [standardWeight, setStandardWeight] = useState(8);
  const [aliasesInput, setAliasesInput] = useState('');
  const [demandLevel, setDemandLevel] =
    useState<SkillTaxonomyItem['demandLevel']>('High');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return taxonomy.filter(
      (t) =>
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.aliases.some((a) => a.toLowerCase().includes(q))
    );
  }, [taxonomy, search]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addTaxonomySkill({
      name: name.trim(),
      category,
      standardWeight: Number(standardWeight),
      aliases: aliasesInput
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
      demandLevel,
    });
    setName('');
    setAliasesInput('');
    setModalOpen(false);
  };

  return (
    <DashboardLayout
      title="Skill Taxonomy Management"
      breadcrumb="Platform Admin / Skill Management"
    >
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#0F172A] font-display">
            Canonical Technical Skill Taxonomy
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Standardized skill definitions, extraction aliases, and default matching weights.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search taxonomy or alias..."
            className="w-56"
          />
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Taxonomy Skill</span>
          </button>
        </div>
      </div>

      <div className="mt-6 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">Canonical Skill</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Parser Aliases</th>
                <th className="py-3 px-4 text-right">Standard Weight</th>
                <th className="py-3 px-4">Market Demand</th>
                <th className="py-3 px-4 text-right">Remove</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-medium text-[#0F172A]">
                    {item.name}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600">
                    {item.category}
                  </td>
                  <td className="py-3 px-4 text-xs font-mono-tabular text-slate-500">
                    {item.aliases.join(', ') || '—'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-tabular text-xs font-semibold text-[#2563EB]">
                    {item.standardWeight} / 10
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-700">
                    {item.demandLevel}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => deleteTaxonomySkill(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Skill to Taxonomy"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Canonical Skill Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. GraphQL"
              className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SkillCategory)}
                className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Standard Weight (1–10)
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={standardWeight}
                onChange={(e) => setStandardWeight(Number(e.target.value))}
                className="w-full h-10 px-3 text-sm font-mono-tabular border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Parser Aliases (comma-separated)
              </label>
              <input
                type="text"
                value={aliasesInput}
                onChange={(e) => setAliasesInput(e.target.value)}
                placeholder="gql, apollo"
                className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Market Demand
              </label>
              <select
                value={demandLevel}
                onChange={(e) =>
                  setDemandLevel(
                    e.target.value as SkillTaxonomyItem['demandLevel']
                  )
                }
                className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg bg-white"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
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
              Add Skill
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
