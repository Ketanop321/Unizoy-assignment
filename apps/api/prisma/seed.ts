import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password.js';

type JobType = 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT';

const prisma = new PrismaClient();

const sampleJobs: Array<{
  title: string;
  department: string;
  location: string;
  type: JobType;
  description: string;
  requirements: string[];
}> = [
  {
    title: 'AI Backend Engineer',
    department: 'Engineering',
    location: 'Surat / Remote',
    type: 'FULL_TIME',
    description:
      'Build production-grade AI APIs, orchestration services, and data-intensive backend systems.',
    requirements: ['Node.js + TypeScript', 'PostgreSQL + Prisma', 'REST API architecture'],
  },
  {
    title: 'Frontend Engineer (Next.js)',
    department: 'Engineering',
    location: 'Remote',
    type: 'FULL_TIME',
    description:
      'Develop polished, high-performance UI experiences with animation and robust state management.',
    requirements: ['Next.js App Router', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    title: 'AI Solutions Intern',
    department: 'AI Delivery',
    location: 'Surat',
    type: 'INTERNSHIP',
    description:
      'Support rapid prototyping and delivery of AI workflow solutions in real client environments.',
    requirements: ['Python basics', 'Prompt engineering fundamentals', 'Team communication'],
  },
  {
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    location: 'Remote',
    type: 'CONTRACT',
    description:
      'Own deployment reliability, observability, and release automation for AI products.',
    requirements: ['Docker', 'CI/CD pipelines', 'Cloud hosting platforms'],
  },
  {
    title: 'Product Operations Associate',
    department: 'Operations',
    location: 'Surat',
    type: 'PART_TIME',
    description:
      'Coordinate product execution, QA feedback loops, and cross-functional delivery timelines.',
    requirements: ['Process orientation', 'Documentation skills', 'Attention to detail'],
  },
];

const run = async (): Promise<void> => {
  const seedPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Admin@123';
  const passwordHash = await hashPassword(seedPassword);

  const admin = await prisma.user.upsert({
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

  for (const job of sampleJobs) {
    const existingJob = await prisma.job.findFirst({
      where: {
        title: job.title,
        createdById: admin.id,
      },
    });

    if (existingJob) {
      await prisma.job.update({
        where: { id: existingJob.id },
        data: {
          department: job.department,
          location: job.location,
          type: job.type,
          description: job.description,
          requirements: job.requirements,
          isActive: true,
        },
      });
    } else {
      await prisma.job.create({
        data: {
          title: job.title,
          department: job.department,
          location: job.location,
          type: job.type,
          description: job.description,
          requirements: job.requirements,
          createdById: admin.id,
        },
      });
    }
  }

  const existingApplication = await prisma.application.findFirst();
  if (!existingApplication) {
    const firstJob = await prisma.job.findFirst({ where: { isActive: true } });
    if (firstJob) {
      await prisma.application.create({
        data: {
          jobId: firstJob.id,
          candidateName: 'Demo Candidate',
          candidateEmail: 'candidate@example.com',
          resumeLink: 'https://example.com/resume/demo-candidate',
          coverNote: 'I am excited to apply for this role.',
          status: 'PENDING',
        },
      });
    }
  }

  console.log('Seed complete. Admin email: admin@unizoy.com');
};

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
