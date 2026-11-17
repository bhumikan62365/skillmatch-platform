import React, { useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DashboardLayout } from '../../components/ui/DashboardLayout';
import { adminService } from '../../services/adminService';

export function SystemSettingsPage() {
  const { settings, updateSettings, activities, resetDemoData } = useApp();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const saved = await adminService.savePlatformSettings(form);
    updateSettings(saved);
    setSaving(false);
  };

  return (
    <DashboardLayout
      title="System Settings"
      breadcrumb="Platform Admin / System Settings"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <h2 className="text-base font-semibold text-[#0F172A] font-display">
            Matching Engine & Governance Rules
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure global placement readiness thresholds and onboarding policies.
          </p>

          <form onSubmit={handleSave} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Placement-Ready Score Threshold (%)
              </label>
              <input
                type="number"
                min={40}
                max={95}
                value={form.readyThresholdScore}
                onChange={(e) =>
                  setForm({
                    ...form,
                    readyThresholdScore: Number(e.target.value),
                  })
                }
                className="w-full h-10 px-3 text-sm font-mono-tabular border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Active Academic Cohort Year
              </label>
              <input
                type="text"
                value={form.defaultAcademicYear}
                onChange={(e) =>
                  setForm({ ...form, defaultAcademicYear: e.target.value })
                }
                className="w-full h-10 px-3 text-sm font-mono-tabular border border-slate-200 rounded-lg"
              />
            </div>

            <label className="flex items-center justify-between gap-4 py-2 border-t border-slate-100 cursor-pointer">
              <div>
                <p className="text-sm font-medium text-[#0F172A]">
                  Prioritize Practical Evidence Over Resume Mentions
                </p>
                <p className="text-xs text-slate-500">
                  Highlight project-verified competencies in compatibility breakdowns.
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.requirePracticalEvidenceBonus}
                onChange={(e) =>
                  setForm({
                    ...form,
                    requirePracticalEvidenceBonus: e.target.checked,
                  })
                }
                className="w-4 h-4 accent-[#2563EB]"
              />
            </label>

            <label className="flex items-center justify-between gap-4 py-2 border-t border-slate-100 cursor-pointer">
              <div>
                <p className="text-sm font-medium text-[#0F172A]">
                  Automatic Resume Skill Extraction
                </p>
                <p className="text-xs text-slate-500">
                  Parse uploaded PDF/DOCX resumes automatically upon submission.
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.autoResumeExtraction}
                onChange={(e) =>
                  setForm({ ...form, autoResumeExtraction: e.target.checked })
                }
                className="w-4 h-4 accent-[#2563EB]"
              />
            </label>

            <label className="flex items-center justify-between gap-4 py-2 border-t border-slate-100 cursor-pointer">
              <div>
                <p className="text-sm font-medium text-[#0F172A]">
                  Allow Student Self-Registration
                </p>
                <p className="text-xs text-slate-500">
                  Enable students to register directly with institutional emails.
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.allowStudentSelfRegistration}
                onChange={(e) =>
                  setForm({
                    ...form,
                    allowStudentSelfRegistration: e.target.checked,
                  })
                }
                className="w-4 h-4 accent-[#2563EB]"
              />
            </label>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={resetDemoData}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Platform Data
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <h3 className="text-base font-semibold text-[#0F172A] font-display mb-4">
            Audit & Activity Log
          </h3>
          <div className="divide-y divide-slate-100">
            {activities.slice(0, 8).map((act) => (
              <div key={act.id} className="py-3 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-[#0F172A]">
                    {act.title}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {act.detail}
                  </p>
                </div>
                <span className="text-[11px] font-mono-tabular text-slate-400 whitespace-nowrap shrink-0">
                  {act.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
