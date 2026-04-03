import { prisma } from '../config/prisma.js';

type ApplicationStatus = 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED';

interface ApplicationFilters {
  page: number;
  pageSize: number;
  search?: string;
  status?: ApplicationStatus;
  jobId?: string;
}

export const applicationRepository = {
  create: async (payload: {
    jobId: string;
    candidateName: string;
    candidateEmail: string;
    resumeLink: string;
    coverNote?: string;
  }) =>
    prisma.application.create({
      data: payload,
    }),

  findByJobAndEmail: async (jobId: string, candidateEmail: string) =>
    prisma.application.findUnique({
      where: {
        jobId_candidateEmail: {
          jobId,
          candidateEmail,
        },
      },
    }),

  findById: async (id: string) =>
    prisma.application.findUnique({
      where: { id },
      include: {
        job: true,
      },
    }),

  list: async (filters: ApplicationFilters) => {
    const skip = (filters.page - 1) * filters.pageSize;

    const where = {
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.jobId ? { jobId: filters.jobId } : {}),
      ...(filters.search
        ? {
            OR: [
              { candidateName: { contains: filters.search, mode: 'insensitive' as const } },
              { candidateEmail: { contains: filters.search, mode: 'insensitive' as const } },
              {
                job: {
                  title: { contains: filters.search, mode: 'insensitive' as const },
                },
              },
            ],
          }
        : {}),
    };

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          job: {
            select: {
              id: true,
              title: true,
              department: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: filters.pageSize,
      }),
      prisma.application.count({ where }),
    ]);

    return { applications, total };
  },

  updateStatus: async (id: string, status: ApplicationStatus) =>
    prisma.application.update({
      where: { id },
      data: { status },
      include: { job: true },
    }),
};
