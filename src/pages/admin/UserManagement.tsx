import React, { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DashboardLayout } from '../../components/ui/DashboardLayout';
import { SearchBar } from '../../components/ui/SearchBar';
import { FilterDropdown } from '../../components/ui/FilterDropdown';
import { Modal } from '../../components/ui/Modal';
import { UserAccount, UserRole } from '../../types';

export function UserManagement() {
  const { users, addUserAccount, updateUserRoleAndStatus } = useApp();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [institution, setInstitution] = useState('RV College of Engineering');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchQuery =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.institution.toLowerCase().includes(q);
      const matchRole = roleFilter === 'All' || u.role === roleFilter;
      return matchQuery && matchRole;
    });
  }, [users, search, roleFilter]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    addUserAccount({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      institution: institution.trim(),
      status: 'Active',
    });
    setName('');
    setEmail('');
    setModalOpen(false);
  };

  return (
    <DashboardLayout
      title="User & Role Management"
      breadcrumb="Platform Admin / User Management"
    >
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#0F172A] font-display">
            Platform Accounts & Access Control
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
            {filtered.length} accounts across Student, Placement Officer, and Administrator roles
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search user or email..."
            className="w-52"
          />
          <FilterDropdown
            label="Role"
            value={roleFilter}
            onChange={setRoleFilter}
            options={[
              { label: 'All Roles', value: 'All' },
              { label: 'Students', value: 'student' },
              { label: 'Placement Officers', value: 'placement_officer' },
              { label: 'Administrators', value: 'admin' },
            ]}
            className="w-44"
          />
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      <div className="mt-6 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Institution</th>
                <th className="py-3 px-4">Role Assignment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4">
                    <div className="font-medium text-[#0F172A]">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600">
                    {user.institution}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      aria-label={`Role for ${user.name}`}
                      value={user.role}
                      onChange={(e) =>
                        updateUserRoleAndStatus(
                          user.id,
                          e.target.value as UserRole,
                          user.status
                        )
                      }
                      className="h-8 px-2 text-xs border border-slate-200 rounded-md bg-white"
                    >
                      <option value="student">Student</option>
                      <option value="placement_officer">Placement Officer</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      aria-label={`Status for ${user.name}`}
                      value={user.status}
                      onChange={(e) =>
                        updateUserRoleAndStatus(
                          user.id,
                          user.role,
                          e.target.value as UserAccount['status']
                        )
                      }
                      className="h-8 px-2 text-xs border border-slate-200 rounded-md bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right text-xs text-slate-500">
                    {user.lastActive}
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
        title="Provision New User"
        subtitle="Create an institutional account and assign role permissions."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg bg-white"
              >
                <option value="student">Student</option>
                <option value="placement_officer">Placement Officer</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Institution
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg"
                required
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
              Create User
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
