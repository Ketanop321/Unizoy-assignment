import { z } from 'zod';

const APPLICATION_STATUSES = ['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED'] as const;

export const applyToJobSchema = z.object({
  candidateName: z.string().min(2).max(100),
  candidateEmail: z.string().email(),
  resumeLink: z.string().url(),
  coverNote: z.string().max(2000).optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(APPLICATION_STATUSES),
});

export const applicationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  status: z.enum(APPLICATION_STATUSES).optional(),
  jobId: z.string().uuid().optional(),
  search: z.string().optional(),
});
