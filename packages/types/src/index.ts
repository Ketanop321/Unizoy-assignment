export const USER_ROLES = ['ADMIN', 'CANDIDATE'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT'] as const;
export type JobType = (typeof JOB_TYPES)[number];

export const APPLICATION_STATUSES = ['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED'] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export interface ApiErrorPayload {
  code: string;
  details?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  error?: ApiErrorPayload;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface JobListItem {
  id: string;
  title: string;
  department: string;
  location: string;
  type: JobType;
  description: string;
  requirements: string[];
  isActive: boolean;
  createdAt: string;
}

export interface JobApplicationInput {
  candidateName: string;
  candidateEmail: string;
  resumeLink: string;
  coverNote?: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
