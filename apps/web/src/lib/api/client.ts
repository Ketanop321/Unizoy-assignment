import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse, SessionUser } from './types';

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
let csrfToken: string | null = null;

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

const getFreshCsrfToken = async (): Promise<string> => {
  const response = await axios.get<ApiResponse<{ csrfToken: string }>>(
    `${baseURL}/api/v1/auth/csrf-token`,
    { withCredentials: true },
  );

  return response.data.data.csrfToken;
};

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const method = config.method?.toUpperCase();
  const isStateChanging = method === 'POST' || method === 'PATCH' || method === 'PUT' || method === 'DELETE';

  if (isStateChanging) {
    if (!csrfToken) {
      csrfToken = await getFreshCsrfToken();
    }

    config.headers.set('x-csrf-token', csrfToken);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<null>>) => {
    const originalConfig = error.config as RetryConfig | undefined;

    if (error.response?.status === 401 && originalConfig && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        await apiClient.post<ApiResponse<SessionUser>>('/api/v1/auth/refresh');
        return apiClient(originalConfig);
      } catch {
        csrfToken = null;
      }
    }

    if (error.response?.status === 403) {
      csrfToken = null;
    }

    return Promise.reject(error);
  },
);
