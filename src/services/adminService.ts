import { PlatformSettings, UserAccount } from '../types';
import { executeMockableRequest } from './apiClient';

export const adminService = {
  async savePlatformSettings(settings: PlatformSettings): Promise<PlatformSettings> {
    return executeMockableRequest(
      { endpoint: '/admin/settings', method: 'PUT', body: settings },
      () => settings,
      150
    );
  },

  computeRoleDistribution(users: UserAccount[]) {
    return [
      {
        role: 'Students',
        count: users.filter((u) => u.role === 'student').length,
      },
      {
        role: 'Placement Officers',
        count: users.filter((u) => u.role === 'placement_officer').length,
      },
      {
        role: 'Administrators',
        count: users.filter((u) => u.role === 'admin').length,
      },
    ];
  },
};
