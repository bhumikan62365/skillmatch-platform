import React, { useState } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DashboardLayout } from '../../components/ui/DashboardLayout';

export function SettingsPage() {
  const { currentUser, addToast, resetDemoData } = useApp();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Preferences updated',
      message: 'Notification settings saved for your account.',
    });
  };

  return (
    <DashboardLayout title="Settings" breadcrumb="Account / Settings">
      <div className="max-w-2xl space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <h2 className="text-base font-semibold text-[#0F172A] font-display">
            Account Preferences
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Signed in as {currentUser?.name} ({currentUser?.email})
          </p>

          <form onSubmit={handleSave} className="mt-5 space-y-4">
            <label className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 cursor-pointer">
              <div>
                <p className="text-sm font-medium text-[#0F172A]">
                  Job Match Alerts
                </p>
                <p className="text-xs text-slate-500">
                  Receive notifications when new jobs exceed 70% compatibility.
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 accent-[#2563EB]"
              />
            </label>

            <label className="flex items-center justify-between gap-4 py-2 cursor-pointer">
              <div>
                <p className="text-sm font-medium text-[#0F172A]">
                  Weekly Skill Readiness Summary
                </p>
                <p className="text-xs text-slate-500">
                  Digest of learning progress and placement drive deadlines.
                </p>
              </div>
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
                className="w-4 h-4 accent-[#2563EB]"
              />
            </label>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                Save Preferences
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-[#0F172A] font-display">
              Reset Workspace Sample Data
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Restore initial students, job listings, and learning roadmap records.
            </p>
          </div>
          <button
            type="button"
            onClick={resetDemoData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Data
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
