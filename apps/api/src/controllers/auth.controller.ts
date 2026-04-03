import type { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { successResponse } from '../utils/api-response.js';
import { asyncHandler } from '../utils/async-handler.js';
import { clearAuthCookies, setAuthCookies } from '../utils/cookies.js';

export const authController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body as { email: string; password: string };

    const user = await authService.loginAdmin(email, password);
    setAuthCookies(res, user);

    res.status(200).json(successResponse('Login successful', user));
  }),

  logout: asyncHandler(async (_req: Request, res: Response) => {
    clearAuthCookies(res);
    res.status(200).json(successResponse('Logout successful', null));
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const user = await authService.getAuthenticatedUser(userId);

    res.status(200).json(successResponse('Authenticated user', user));
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = (req.cookies?.refreshToken as string | undefined) ?? req.body.refreshToken;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        data: null,
        message: 'Refresh token required',
        error: { code: 'UNAUTHORIZED' },
      });
      return;
    }

    const user = await authService.refreshSession(refreshToken);
    setAuthCookies(res, user);

    res.status(200).json(successResponse('Session refreshed', user));
  }),
};
