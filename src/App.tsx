import React from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer } from './components/ui/ToastContainer';
import { UserRole } from './types';

import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfile } from './pages/student/StudentProfile';
import { ResumeAnalyzer } from './pages/student/ResumeAnalyzer';
import { MySkills } from './pages/student/MySkills';
import { MyProjects } from './pages/student/MyProjects';
import { FindJobs } from './pages/student/FindJobs';
import { JobMatchDetails } from './pages/student/JobMatchDetails';
import { SkillGapAnalysis } from './pages/student/SkillGapAnalysis';
import { LearningRoadmap } from './pages/student/LearningRoadmap';

import { PlacementDashboard } from './pages/placement/PlacementDashboard';
import { StudentDirectory } from './pages/placement/StudentDirectory';
import { SkillAnalytics } from './pages/placement/SkillAnalytics';
import { JobManagement } from './pages/placement/JobManagement';
import { SkillGapReports } from './pages/placement/SkillGapReports';
import { PlacementTracking } from './pages/placement/PlacementTracking';
import { ReportsPage } from './pages/placement/ReportsPage';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { InstitutionsPage } from './pages/admin/InstitutionsPage';
import { SkillTaxonomyPage } from './pages/admin/SkillTaxonomyPage';
import { SystemSettingsPage } from './pages/admin/SystemSettingsPage';

import { SettingsPage } from './pages/shared/SettingsPage';

function RoleGuard({
  allowedRole,
  children,
}: {
  allowedRole: UserRole;
  children: React.ReactNode;
}) {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== allowedRole) {
    const fallback =
      currentUser.role === 'student'
        ? '/student/dashboard'
        : currentUser.role === 'placement_officer'
        ? '/placement/dashboard'
        : '/admin/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}

function DefaultRedirect() {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role === 'student')
    return <Navigate to="/student/dashboard" replace />;
  if (currentUser.role === 'placement_officer')
    return <Navigate to="/placement/dashboard" replace />;
  return <Navigate to="/admin/dashboard" replace />;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DefaultRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Student Portal */}
          <Route
            path="/student/dashboard"
            element={
              <RoleGuard allowedRole="student">
                <StudentDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/student/profile"
            element={
              <RoleGuard allowedRole="student">
                <StudentProfile />
              </RoleGuard>
            }
          />
          <Route
            path="/student/resume"
            element={
              <RoleGuard allowedRole="student">
                <ResumeAnalyzer />
              </RoleGuard>
            }
          />
          <Route
            path="/student/skills"
            element={
              <RoleGuard allowedRole="student">
                <MySkills />
              </RoleGuard>
            }
          />
          <Route
            path="/student/projects"
            element={
              <RoleGuard allowedRole="student">
                <MyProjects />
              </RoleGuard>
            }
          />
          <Route
            path="/student/jobs"
            element={
              <RoleGuard allowedRole="student">
                <FindJobs />
              </RoleGuard>
            }
          />
          <Route
            path="/student/jobs/:jobId"
            element={
              <RoleGuard allowedRole="student">
                <JobMatchDetails />
              </RoleGuard>
            }
          />
          <Route
            path="/student/skill-gaps"
            element={
              <RoleGuard allowedRole="student">
                <SkillGapAnalysis />
              </RoleGuard>
            }
          />
          <Route
            path="/student/roadmap"
            element={
              <RoleGuard allowedRole="student">
                <LearningRoadmap />
              </RoleGuard>
            }
          />
          <Route
            path="/student/settings"
            element={
              <RoleGuard allowedRole="student">
                <SettingsPage />
              </RoleGuard>
            }
          />

          {/* Placement Officer Portal */}
          <Route
            path="/placement/dashboard"
            element={
              <RoleGuard allowedRole="placement_officer">
                <PlacementDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/placement/students"
            element={
              <RoleGuard allowedRole="placement_officer">
                <StudentDirectory />
              </RoleGuard>
            }
          />
          <Route
            path="/placement/analytics"
            element={
              <RoleGuard allowedRole="placement_officer">
                <SkillAnalytics />
              </RoleGuard>
            }
          />
          <Route
            path="/placement/jobs"
            element={
              <RoleGuard allowedRole="placement_officer">
                <JobManagement />
              </RoleGuard>
            }
          />
          <Route
            path="/placement/skill-gaps"
            element={
              <RoleGuard allowedRole="placement_officer">
                <SkillGapReports />
              </RoleGuard>
            }
          />
          <Route
            path="/placement/tracking"
            element={
              <RoleGuard allowedRole="placement_officer">
                <PlacementTracking />
              </RoleGuard>
            }
          />
          <Route
            path="/placement/reports"
            element={
              <RoleGuard allowedRole="placement_officer">
                <ReportsPage />
              </RoleGuard>
            }
          />
          <Route
            path="/placement/settings"
            element={
              <RoleGuard allowedRole="placement_officer">
                <SettingsPage />
              </RoleGuard>
            }
          />

          {/* Admin Portal */}
          <Route
            path="/admin/dashboard"
            element={
              <RoleGuard allowedRole="admin">
                <AdminDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RoleGuard allowedRole="admin">
                <UserManagement />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/institutions"
            element={
              <RoleGuard allowedRole="admin">
                <InstitutionsPage />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/jobs"
            element={
              <RoleGuard allowedRole="admin">
                <JobManagement />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/skills"
            element={
              <RoleGuard allowedRole="admin">
                <SkillTaxonomyPage />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <RoleGuard allowedRole="admin">
                <SystemSettingsPage />
              </RoleGuard>
            }
          />

          <Route path="*" element={<DefaultRedirect />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </AppProvider>
  );
}
