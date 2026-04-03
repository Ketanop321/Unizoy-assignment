import { userRepository } from '../repositories/user.repository.js';
import type { AuthenticatedUser } from '../types/express.js';
import { AppError } from '../utils/app-error.js';
import { comparePassword } from '../utils/password.js';
import { verifyRefreshToken } from '../utils/jwt.js';

export const authService = {
  loginAdmin: async (email: string, password: string): Promise<AuthenticatedUser> => {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new AppError(401, 'UNAUTHORIZED', 'Invalid email or password');
    }

    if (user.role !== 'ADMIN') {
      throw new AppError(403, 'FORBIDDEN', 'Only admins can access this portal');
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError(401, 'UNAUTHORIZED', 'Invalid email or password');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  },

  getAuthenticatedUser: async (id: string): Promise<AuthenticatedUser> => {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError(404, 'NOT_FOUND', 'User not found');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  },

  refreshSession: async (refreshToken: string): Promise<AuthenticatedUser> => {
    const decoded = verifyRefreshToken(refreshToken);

    const user = await userRepository.findById(decoded.id);
    if (!user || user.role !== 'ADMIN') {
      throw new AppError(401, 'UNAUTHORIZED', 'Invalid refresh token');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  },
};
