import type { Request, Response } from 'express';
import { applicationService } from '../services/application.service.js';
import { AppError } from '../utils/app-error.js';
import { successResponse } from '../utils/api-response.js';
import { asyncHandler } from '../utils/async-handler.js';
import { applicationQuerySchema } from '../validators/application.schema.js';

export const applicationController = {
  apply: asyncHandler(async (req: Request, res: Response) => {
    const jobId = req.params.id;
    if (!jobId) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Job id is required');
    }

    const application = await applicationService.applyToJob(jobId, req.body);

    res.status(201).json(successResponse('Application submitted', application));
  }),

  listAdminApplications: asyncHandler(async (req: Request, res: Response) => {
    const query = applicationQuerySchema.parse(req.query);
    const data = await applicationService.listApplications(query);

    res.status(200).json(successResponse('Applications fetched', data));
  }),

  getAdminApplication: asyncHandler(async (req: Request, res: Response) => {
    const applicationId = req.params.id;
    if (!applicationId) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Application id is required');
    }

    const application = await applicationService.getApplicationById(applicationId);

    res.status(200).json(successResponse('Application fetched', application));
  }),

  updateAdminApplicationStatus: asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body as { status: 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED' };
    const applicationId = req.params.id;
    if (!applicationId) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Application id is required');
    }

    const application = await applicationService.updateStatus(applicationId, status);

    res.status(200).json(successResponse('Application status updated', application));
  }),
};
