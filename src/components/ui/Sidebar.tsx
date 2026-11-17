import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FileSearch,
  Award,
  FolderGit2,
  Briefcase,
  Target,
  Map,
  Settings,
  Users,
  BarChart3,
  ClipboardList,
  CheckSquare,
  FileSpreadsheet,
  Building2,
  Tags,
  X,
  Compass,
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  student: [
    { label: 'Dashboard', to: '/student/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', to: '/student/profile', icon: User },
    { label: 'Resume Analyzer', to: '/student/resume', icon: FileSearch },
    { label: 'My Skills', to: '/student/skills', icon: Award },
    { label: 'My Projects', to: '/student/projects', icon: FolderGit2 },
    { label: 'Find Jobs', to: '/student/jobs', icon: Briefcase },
    { label: 'Skill Gap Analysis', to: '/student/skill-gaps', icon: Target },
    { label: 'Learning Roadmap', to: '/student/roadmap', icon: Map },
    { label: 'Settings', to: '/student/settings', icon: Settings },
  ],
  placement_officer: [
    { label: 'Dashboard', to: '/placement/dashboard', icon: LayoutDashboard },
    { label: 'Student Directory', to: '/placement/students', icon: Users },
    { label: 'Skill Analytics', to: '/placement/analytics', icon: BarChart3 },
    { label: 'Job Management', to: '/placement/jobs', icon: Briefcase },
    { label: 'Skill Gap Reports', to: '/placement/skill-gaps', icon: ClipboardList },
    { label: 'Placement Tracking', to: '/placement/tracking', icon: CheckSquare },
    { label: 'Reports', to: '/placement/reports', icon: FileSpreadsheet },
    { label: 'Settings', to: '/placement/settings', icon: Settings },
  ],
  admin: [
    { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'User Management', to: '/admin/users', icon: Users },
    { label: 'Institutions', to: '/admin/institutions', icon: Building2 },
    { label: 'Job Management', to: '/admin/jobs', icon: Briefcase },
    { label: 'Skill Management', to: '/admin/skills', icon: Tags },
    { label: 'System Settings', to: '/admin/settings', icon: Settings },
  ],
};

interface SidebarProps {
  role: UserRole;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ role, mobileOpen, onCloseMobile }: SidebarProps) {
  const items = NAV_BY_ROLE[role];
  const roleLabel =
    role === 'student'
      ? 'Student Portal'
      : role === 'placement_officer'
      ? 'Placement Cell'
      : 'Platform Admin';

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-64">
      <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4" aria-hidden="true" />
          </div>
          <span className="font-display font-bold text-sm text-[#0F172A] truncate">
            Skill-to-Job
          </span>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation"
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-4 pt-5 pb-2">
        <p className="px-2 text-xs font-medium text-slate-400">{roleLabel}</p>
      </div>

      <nav className="flex-1 px-3 pb-4 space-y-1 overflow-y-auto" aria-label="Primary navigation">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-50 text-[#2563EB]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#0F172A]'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block shrink-0">{content}</aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-10 h-full">{content}</aside>
        </div>
      )}
    </>
  );
}
