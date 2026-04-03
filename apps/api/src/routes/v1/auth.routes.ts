import { Router } from 'express';
import { authController } from '../../controllers/auth.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authLimiter } from '../../middleware/rate-limiters.js';
import { validateBody } from '../../middleware/validate-body.js';
import { loginSchema } from '../../validators/auth.schema.js';

export const authRouter = Router();

authRouter.post('/login', authLimiter, validateBody(loginSchema), authController.login);
authRouter.post('/logout', authController.logout);
authRouter.get('/me', authenticate, authController.me);
authRouter.post('/refresh', authController.refresh);
