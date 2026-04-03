import { Router } from 'express';
import { applicationController } from '../../controllers/application.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { adminWriteLimiter, applicationLimiter } from '../../middleware/rate-limiters.js';
import { requireAdmin } from '../../middleware/require-admin.js';
import { validateBody } from '../../middleware/validate-body.js';
import {
  applyToJobSchema,
  updateApplicationStatusSchema,
} from '../../validators/application.schema.js';

export const applicationsRouter = Router();

applicationsRouter.post('/jobs/:id/apply', applicationLimiter, validateBody(applyToJobSchema), applicationController.apply);

applicationsRouter.get(
  '/admin/applications',
  authenticate,
  requireAdmin,
  applicationController.listAdminApplications,
);
applicationsRouter.get(
  '/admin/applications/:id',
  authenticate,
  requireAdmin,
  applicationController.getAdminApplication,
);
applicationsRouter.patch(
  '/admin/applications/:id/status',
  authenticate,
  requireAdmin,
  adminWriteLimiter,
  validateBody(updateApplicationStatusSchema),
  applicationController.updateAdminApplicationStatus,
);
