import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password.js';

const prisma = new PrismaClient();

const run = async (): Promise<void> => {
  const seedPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Admin@123';
  const passwordHash = await hashPassword(seedPassword);

  await prisma.user.upsert({
    where: { email: 'admin@unizoy.com' },
    update: {
      passwordHash,
      role: 'ADMIN',
    },
    create: {
      email: 'admin@unizoy.com',
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('Seed complete. Admin account ensured: admin@unizoy.com');
};

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
