import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { UserRole } from '../../types';
import { useApp } from '../../context/AppContext';

const ROLE_OPTIONS: { value: UserRole; label: string; email: string }[] = [
  { value: 'student', label: 'Student', email: 'aarav.sharma@rvce.edu.in' },
  {
    value: 'placement_officer',
    label: 'Placement Officer',
    email: 'placement@rvce.edu.in',
  },
  { value: 'admin', label: 'Administrator', email: 'admin@skilljob.io' },
];

export function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('aarav.sharma@rvce.edu.in');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRoleSwitch = (nextRole: UserRole) => {
    setRole(nextRole);
    setError(null);
    const preset = ROLE_OPTIONS.find((r) => r.value === nextRole);
    if (preset) {
      setEmail(preset.email);
      setPassword('demo1234');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const user = await login({ email, password, role });
      if (user.role === 'student') navigate('/student/dashboard');
      else if (user.role === 'placement_officer') navigate('/placement/dashboard');
      else navigate('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
      {/* Left Brand Column */}
      <div className="lg:w-[44%] bg-[#0F172A] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#2563EB] flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              Skill-to-Job Intelligence
            </span>
          </div>

          <h1 className="mt-12 text-3xl sm:text-4xl font-bold font-display leading-tight tracking-tight max-w-md">
            Connect academic capability with real-world engineering roles.
          </h1>
          <p className="mt-4 text-sm text-slate-300 leading-relaxed max-w-md">
            Extract verified competencies from resumes and projects, inspect explainable compatibility scores, and close institutional skill gaps before placement season.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-3 gap-6 max-w-md">
          <div>
            <p className="text-xl font-bold font-display tabular-nums">6</p>
            <p className="text-xs text-slate-400 mt-0.5">Skill Domains</p>
          </div>
          <div>
            <p className="text-xl font-bold font-display tabular-nums">100%</p>
            <p className="text-xs text-slate-400 mt-0.5">Explainable Weights</p>
          </div>
          <div>
            <p className="text-xl font-bold font-display tabular-nums">3</p>
            <p className="text-xs text-slate-400 mt-0.5">Role Workspaces</p>
          </div>
        </div>
      </div>

      {/* Right Sign-in Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-8 shadow-xs">
          <h2 className="text-xl font-bold text-[#0F172A] font-display">
            Sign in to your workspace
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Select your role and enter your institutional credentials.
          </p>

          {/* Role Selector */}
          <div className="mt-6">
            <label className="block text-xs font-medium text-slate-700 mb-2">
              Account Role
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg">
              {ROLE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleRoleSwitch(opt.value)}
                  className={`py-2 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    role === opt.value
                      ? 'bg-white text-[#0F172A] shadow-xs'
                      : 'text-slate-600 hover:text-[#0F172A]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@institution.edu"
                className="w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-medium text-slate-700"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-[#2563EB] hover:text-blue-700"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full h-10 pl-3 pr-10 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-medium rounded-lg inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              {!loading && <ArrowRight className="w-4 h-4" aria-hidden="true" />}
            </button>
          </form>

          <p className="mt-4 text-[11px] text-slate-500 text-center">
            Demo credentials prefilled when switching roles above.
          </p>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-600">
            New student?{' '}
            <Link
              to="/register"
              className="font-medium text-[#2563EB] hover:text-blue-700"
            >
              Create a student account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
