import { jobRepository } from '../repositories/job.repository.js';
import { AppError } from '../utils/app-error.js';

type JobType = 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT';

interface JobFilters {
  page: number;
  pageSize: number;
  search?: string;
  type?: JobType;
  department?: string;
  includeInactive?: boolean;
}

export const jobService = {
  listJobs: async (filters: JobFilters) => {
    const { jobs, total } = await jobRepository.list(filters);

    return {
      items: jobs,
      pagination: {
        page: filters.page,
        pageSize: filters.pageSize,
        total,
        totalPages: Math.ceil(total / filters.pageSize),
      },
    };
  },

  getJobById: async (id: string, includeInactive = false) => {
    const job = await jobRepository.findById(id, includeInactive);

    if (!job) {
      throw new AppError(404, 'NOT_FOUND', 'Job not found');
    }

    return job;
  },

  createJob: async (payload: {
    title: string;
    department: string;
    location: string;
    type: JobType;
    description: string;
    requirements: string[];
    isActive?: boolean;
    createdById: string;
  }) => jobRepository.create(payload),

  updateJob: async (
    id: string,
    payload: Partial<{
      title: string;
      department: string;
      location: string;
      type: JobType;
      description: string;
      requirements: string[];
      isActive: boolean;
    }>,
  ) => {
    await jobService.getJobById(id, true);
    return jobRepository.update(id, payload);
  },

  softDeleteJob: async (id: string) => {
    await jobService.getJobById(id, true);
    return jobRepository.softDelete(id);
  },
};
