import { prisma } from '../config/prisma.js';

export const userRepository = {
  findByEmail: async (email: string) =>
    prisma.user.findUnique({
      where: { email },
    }),

  findById: async (id: string) =>
    prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
      },
    }),
};
