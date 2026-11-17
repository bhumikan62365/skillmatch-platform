/**
 * Backend-ready API client abstraction.
 * Currently backed by local service persistence for immediate prototyping;
 * replace baseUrl & fetch calls to connect directly to Python FastAPI + PostgreSQL + Supabase.
 */

export interface ApiRequestConfig {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string;
}

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  storageBucket: 'student-resumes',
};

export async function executeMockableRequest<T>(
  _config: ApiRequestConfig,
  resolver: () => T | Promise<T>,
  delayMs = 140
): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return await resolver();
}
