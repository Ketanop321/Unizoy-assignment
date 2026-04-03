import { z } from 'zod';

const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT'] as const;

export const createJobSchema = z.object({
  title: z.string().min(3).max(120),
  department: z.string().min(2).max(80),
  location: z.string().min(2).max(120),
  type: z.enum(JOB_TYPES),
  description: z.string().min(20),
  requirements: z.array(z.string().min(2)).min(1),
  isActive: z.boolean().optional(),
});

export const updateJobSchema = createJobSchema.partial().refine(
  (payload) => Object.keys(payload).length > 0,
  'At least one field must be provided',
);

export const jobQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().optional(),
  type: z.enum(JOB_TYPES).optional(),
  department: z.string().optional(),
  includeInactive: z.coerce.boolean().optional(),
});
