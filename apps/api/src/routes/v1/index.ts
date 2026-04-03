import { Router } from 'express';
import { applicationsRouter } from './applications.routes.js';
import { authRouter } from './auth.routes.js';
import { jobsRouter } from './jobs.routes.js';

export const v1Router = Router();

v1Router.use('/auth', authRouter);
v1Router.use('/', jobsRouter);
v1Router.use('/', applicationsRouter);
