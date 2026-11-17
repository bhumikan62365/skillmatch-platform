import { UserAccount, UserRole } from '../types';
import { executeMockableRequest } from './apiClient';
import { STUDENT_AVATAR } from './mockData';

export interface LoginPayload {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterStudentPayload {
  name: string;
  email: string;
  password: string;
  usn: string;
  institution: string;
  department: string;
  graduationYear: number;
}

export const authService = {
  async login(
    payload: LoginPayload,
    users: UserAccount[]
  ): Promise<{ user: UserAccount; token: string }> {
    return executeMockableRequest(
      { endpoint: '/auth/login', method: 'POST', body: payload },
      () => {
        if (!payload.email.includes('@')) {
          throw new Error('Please enter a valid institutional or work email address.');
        }
        if (payload.password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }

        const matched = users.find(
          (u) =>
            u.email.toLowerCase() === payload.email.trim().toLowerCase() &&
            u.role === payload.role
        );

        if (matched) {
          if (matched.status === 'Suspended') {
            throw new Error('This account has been suspended by the platform administrator.');
          }
          return { user: matched, token: `mock-jwt-${matched.id}` };
        }

        // Fallback to first matching role demo account if credentials follow demo pattern
        const roleMismatch = users.find(
          (u) => u.email.toLowerCase() === payload.email.trim().toLowerCase()
        );
        if (roleMismatch) {
          throw new Error(
            `This email is registered under the "${roleMismatch.role.replace('_', ' ')}" role. Switch role selection to continue.`
          );
        }

        throw new Error('Invalid credentials. Use the quick demo fill or verify your email & role.');
      }
    );
  },

  async registerStudent(
    payload: RegisterStudentPayload
  ): Promise<{ user: UserAccount; token: string }> {
    return executeMockableRequest(
      { endpoint: '/auth/register', method: 'POST', body: payload },
      () => {
        if (payload.password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        const newUser: UserAccount = {
          id: `usr-${Date.now()}`,
          name: payload.name.trim(),
          email: payload.email.trim().toLowerCase(),
          role: 'student',
          avatarUrl: STUDENT_AVATAR,
          institution: payload.institution,
          status: 'Active',
          lastActive: 'Just now',
        };
        return { user: newUser, token: `mock-jwt-${newUser.id}` };
      }
    );
  },

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    return executeMockableRequest(
      { endpoint: '/auth/forgot-password', method: 'POST', body: { email } },
      () => {
        if (!email.includes('@')) {
          throw new Error('Enter a valid email address to receive recovery instructions.');
        }
        return {
          message: `Password recovery link dispatched to ${email}. Check your institutional inbox.`,
        };
      }
    );
  },
};
