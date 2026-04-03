import { applicationRepository } from '../repositories/application.repository.js';
import { jobRepository } from '../repositories/job.repository.js';
import { AppError } from '../utils/app-error.js';

type ApplicationStatus = 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED';

interface ApplicationFilters {
  page: number;
  pageSize: number;
  search?: string;
  status?: ApplicationStatus;
  jobId?: string;
}

export const applicationService = {
  applyToJob: async (jobId: string, payload: {
    candidateName: string;
    candidateEmail: string;
    resumeLink: string;
    coverNote?: string;
  }) => {
    const job = await jobRepository.findById(jobId);
    if (!job) {
      throw new AppError(404, 'NOT_FOUND', 'Job not found or not active');
    }

    const existing = await applicationRepository.findByJobAndEmail(jobId, payload.candidateEmail);
    if (existing) {
      throw new AppError(409, 'CONFLICT', 'You have already applied to this job');
    }

    return applicationRepository.create({
      jobId,
      candidateName: payload.candidateName,
      candidateEmail: payload.candidateEmail,
      resumeLink: payload.resumeLink,
      coverNote: payload.coverNote,
    });
  },

  listApplications: async (filters: ApplicationFilters) => {
    const { applications, total } = await applicationRepository.list(filters);

    return {
      items: applications,
      pagination: {
        page: filters.page,
        pageSize: filters.pageSize,
        total,
        totalPages: Math.ceil(total / filters.pageSize),
      },
    };
  },

  getApplicationById: async (id: string) => {
    const application = await applicationRepository.findById(id);

    if (!application) {
      throw new AppError(404, 'NOT_FOUND', 'Application not found');
    }

    return application;
  },

  updateStatus: async (id: string, status: ApplicationStatus) => {
    await applicationService.getApplicationById(id);
    return applicationRepository.updateStatus(id, status);
  },
};
