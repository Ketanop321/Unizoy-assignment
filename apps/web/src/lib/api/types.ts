export type JobType = 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT';
export type ApplicationStatus = 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED';

export interface AuthUser {
  id: string;
  email: string;
  role: 'ADMIN' | 'CANDIDATE';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error?: {
    code: string;
    details?: Record<string, string[]>;
  };
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: JobType;
  description: string;
  requirements: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobListPayload {
  items: Job[];
  pagination: Pagination;
}

export interface JobsQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: JobType | 'ALL';
  department?: string;
}

export interface ApplyPayload {
  candidateName: string;
  candidateEmail: string;
  resumeLink: string;
  coverNote?: string;
}

export interface Application {
  id: string;
  jobId: string;
  candidateName: string;
  candidateEmail: string;
  resumeLink: string;
  coverNote?: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  job?: {
    id: string;
    title: string;
    department: string;
  };
}

export interface ApplicationListPayload {
  items: Application[];
  pagination: Pagination;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export type SessionUser = AuthUser;
