import { Router } from 'express';
import { jobController } from '../../controllers/job.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { adminWriteLimiter } from '../../middleware/rate-limiters.js';
import { requireAdmin } from '../../middleware/require-admin.js';
import { validateBody } from '../../middleware/validate-body.js';
import { createJobSchema, updateJobSchema } from '../../validators/job.schema.js';

export const jobsRouter = Router();

jobsRouter.get('/jobs', jobController.listPublicJobs);
jobsRouter.get('/jobs/:id', jobController.getPublicJob);

jobsRouter.get('/admin/jobs', authenticate, requireAdmin, jobController.listAdminJobs);
jobsRouter.get('/admin/jobs/:id', authenticate, requireAdmin, jobController.getAdminJob);
jobsRouter.post(
  '/jobs',
  authenticate,
  requireAdmin,
  adminWriteLimiter,
  validateBody(createJobSchema),
  jobController.createJob,
);
jobsRouter.patch(
  '/jobs/:id',
  authenticate,
  requireAdmin,
  adminWriteLimiter,
  validateBody(updateJobSchema),
  jobController.updateJob,
);
jobsRouter.delete('/jobs/:id', authenticate, requireAdmin, adminWriteLimiter, jobController.deleteJob);
