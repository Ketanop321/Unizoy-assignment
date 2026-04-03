import { apiClient } from './client';
import type {
  ApiResponse,
  Application,
  ApplicationListPayload,
  ApplyPayload,
  Job,
  JobListPayload,
  JobsQuery,
  LoginPayload,
  SessionUser,
} from './types';

export const api = {
  login: async (payload: LoginPayload): Promise<SessionUser> => {
    const response = await apiClient.post<ApiResponse<SessionUser>>('/api/v1/auth/login', payload);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/api/v1/auth/logout');
  },

  me: async (): Promise<SessionUser> => {
    const response = await apiClient.get<ApiResponse<SessionUser>>('/api/v1/auth/me');
    return response.data.data;
  },

  getJobs: async (query: JobsQuery): Promise<JobListPayload> => {
    const response = await apiClient.get<ApiResponse<JobListPayload>>('/api/v1/jobs', { params: query });
    return response.data.data;
  },

  getJobById: async (id: string): Promise<Job> => {
    const response = await apiClient.get<ApiResponse<Job>>(`/api/v1/jobs/${id}`);
    return response.data.data;
  },

  applyToJob: async (id: string, payload: ApplyPayload): Promise<Application> => {
    const response = await apiClient.post<ApiResponse<Application>>(`/api/v1/jobs/${id}/apply`, payload);
    return response.data.data;
  },

  getAdminJobs: async (query: JobsQuery): Promise<JobListPayload> => {
    const response = await apiClient.get<ApiResponse<JobListPayload>>('/api/v1/admin/jobs', { params: query });
    return response.data.data;
  },

  getAdminJobById: async (id: string): Promise<Job> => {
    const response = await apiClient.get<ApiResponse<Job>>(`/api/v1/admin/jobs/${id}`);
    return response.data.data;
  },

  createJob: async (payload: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job> => {
    const response = await apiClient.post<ApiResponse<Job>>('/api/v1/jobs', payload);
    return response.data.data;
  },

  updateJob: async (id: string, payload: Partial<Omit<Job, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Job> => {
    const response = await apiClient.patch<ApiResponse<Job>>(`/api/v1/jobs/${id}`, payload);
    return response.data.data;
  },

  deleteJob: async (id: string): Promise<Job> => {
    const response = await apiClient.delete<ApiResponse<Job>>(`/api/v1/jobs/${id}`);
    return response.data.data;
  },

  getAdminApplications: async (query: {
    page?: number;
    pageSize?: number;
    status?: string;
    jobId?: string;
    search?: string;
  }): Promise<ApplicationListPayload> => {
    const response = await apiClient.get<ApiResponse<ApplicationListPayload>>('/api/v1/admin/applications', {
      params: query,
    });
    return response.data.data;
  },

  getAdminApplicationById: async (id: string): Promise<Application> => {
    const response = await apiClient.get<ApiResponse<Application>>(`/api/v1/admin/applications/${id}`);
    return response.data.data;
  },

  updateApplicationStatus: async (
    id: string,
    status: 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED',
  ): Promise<Application> => {
    const response = await apiClient.patch<ApiResponse<Application>>(
      `/api/v1/admin/applications/${id}/status`,
      {
        status,
      },
    );
    return response.data.data;
  },
};
