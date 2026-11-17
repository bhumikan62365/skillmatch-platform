import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, Briefcase, Tags, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DashboardLayout } from '../../components/ui/DashboardLayout';
import { StatCard } from '../../components/ui/StatCard';
import { AnalyticsChart } from '../../components/ui/AnalyticsChart';
import { adminService } from '../../services/adminService';

export function AdminDashboard() {
  const { users, institutions, jobs, taxonomy, activities } = useApp();
  const navigate = useNavigate();

  const roleData = adminService.computeRoleDistribution(users);

  return (
    <DashboardLayout
      title="Admin Dashboard"
      breadcrumb="Platform Admin / System Overview"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Platform Users"
          value={users.length}
          hint={`${users.filter((u) => u.status === 'Active').length} active accounts`}
          icon={Users}
          tone="blue"
          onClick={() => navigate('/admin/users')}
        />
        <StatCard
          label="Partner Institutions"
          value={institutions.length}
          hint={`${institutions.filter((i) => i.status === 'Active').length} active campuses`}
          icon={Building2}
          tone="slate"
          onClick={() => navigate('/admin/institutions')}
        />
        <StatCard
          label="Active Job Listings"
          value={jobs.length}
          hint="Synced across matching engine"
          icon={Briefcase}
          tone="emerald"
          onClick={() => navigate('/admin/jobs')}
        />
        <StatCard
          label="Taxonomy Skills"
          value={taxonomy.length}
          hint="Across 6 technical categories"
          icon={Tags}
          tone="amber"
          onClick={() => navigate('/admin/skills')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <AnalyticsChart
          title="User Accounts by Role"
          subtitle="Active Student, Placement Officer, and Administrator distribution"
          type="bar"
          data={roleData}
          dataKey="count"
          nameKey="role"
          height={270}
        />

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#0F172A] font-display">
              System Activity Monitoring
            </h3>
            <button
              type="button"
              onClick={() => navigate('/admin/settings')}
              className="text-xs font-medium text-[#2563EB] hover:text-blue-700 cursor-pointer"
            >
              System Settings
            </button>
          </div>
          <div className="space-y-4">
            {activities.slice(0, 6).map((act) => (
              <div key={act.id} className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#0F172A]">
                    {act.title}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {act.detail} · {act.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
