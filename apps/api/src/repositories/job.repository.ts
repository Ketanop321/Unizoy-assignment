import { prisma } from '../config/prisma.js';

type JobType = 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT';

interface JobListFilters {
  page: number;
  pageSize: number;
  search?: string;
  type?: JobType;
  department?: string;
  includeInactive?: boolean;
}

const buildWhere = ({ search, type, department, includeInactive }: JobListFilters) => {
  const andConditions: Array<Record<string, unknown>> = [];

  if (!includeInactive) {
    andConditions.push({ isActive: true });
  }

  if (search) {
    andConditions.push({
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    });
  }

  if (type) {
    andConditions.push({ type });
  }

  if (department) {
    andConditions.push({ department: { equals: department, mode: 'insensitive' } });
  }

  return andConditions.length > 0 ? { AND: andConditions } : {};
};

export const jobRepository = {
  list: async (filters: JobListFilters) => {
    const skip = (filters.page - 1) * filters.pageSize;
    const where = buildWhere(filters);

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: filters.pageSize,
      }),
      prisma.job.count({ where }),
    ]);

    return { jobs, total };
  },

  findById: async (id: string, includeInactive = false) =>
    prisma.job.findFirst({
      where: {
        id,
        ...(includeInactive ? {} : { isActive: true }),
      },
    }),

  create: async (payload: {
    title: string;
    department: string;
    location: string;
    type: JobType;
    description: string;
    requirements: string[];
    isActive?: boolean;
    createdById: string;
  }) =>
    prisma.job.create({
      data: {
        title: payload.title,
        department: payload.department,
        location: payload.location,
        type: payload.type,
        description: payload.description,
        requirements: payload.requirements,
        isActive: payload.isActive ?? true,
        createdById: payload.createdById,
      },
    }),

  update: async (
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
  ) =>
    prisma.job.update({
      where: { id },
      data: payload,
    }),

  softDelete: async (id: string) =>
    prisma.job.update({
      where: { id },
      data: { isActive: false },
    }),
};
