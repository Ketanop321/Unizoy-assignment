import type { Request, Response } from 'express';
import { jobService } from '../services/job.service.js';
import { AppError } from '../utils/app-error.js';
import { successResponse } from '../utils/api-response.js';
import { asyncHandler } from '../utils/async-handler.js';
import { jobQuerySchema } from '../validators/job.schema.js';

export const jobController = {
  listPublicJobs: asyncHandler(async (req: Request, res: Response) => {
    const query = jobQuerySchema.parse(req.query);

    const result = await jobService.listJobs({
      ...query,
      includeInactive: false,
    });

    res.status(200).json(successResponse('Active jobs fetched', result));
  }),

  listAdminJobs: asyncHandler(async (req: Request, res: Response) => {
    const query = jobQuerySchema.parse(req.query);

    const result = await jobService.listJobs({
      ...query,
      includeInactive: true,
    });

    res.status(200).json(successResponse('All jobs fetched', result));
  }),

  getPublicJob: asyncHandler(async (req: Request, res: Response) => {
    const jobId = req.params.id;
    if (!jobId) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Job id is required');
    }

    const job = await jobService.getJobById(jobId);

    res.status(200).json(successResponse('Job fetched', job));
  }),

  getAdminJob: asyncHandler(async (req: Request, res: Response) => {
    const jobId = req.params.id;
    if (!jobId) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Job id is required');
    }

    const job = await jobService.getJobById(jobId, true);

    res.status(200).json(successResponse('Job fetched', job));
  }),

  createJob: asyncHandler(async (req: Request, res: Response) => {
    const createdById = req.user?.id;
    if (!createdById) {
      throw new AppError(401, 'UNAUTHORIZED', 'Authentication required');
    }

    const job = await jobService.createJob({
      ...req.body,
      createdById,
    });

    res.status(201).json(successResponse('Job created', job));
  }),

  updateJob: asyncHandler(async (req: Request, res: Response) => {
    const jobId = req.params.id;
    if (!jobId) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Job id is required');
    }

    const job = await jobService.updateJob(jobId, req.body);

    res.status(200).json(successResponse('Job updated', job));
  }),

  deleteJob: asyncHandler(async (req: Request, res: Response) => {
    const jobId = req.params.id;
    if (!jobId) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Job id is required');
    }

    const job = await jobService.softDeleteJob(jobId);

    res.status(200).json(successResponse('Job deactivated', job));
  }),
};
