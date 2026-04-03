'use client';

import { useQuery } from '@tanstack/react-query';
import { BriefcaseBusiness, ClipboardList, Clock3 } from 'lucide-react';
import Link from 'next/link';
import { EmptyState } from '@/components/ui/empty-state';
import { StatCard } from '@/components/ui/stat-card';
import { api } from '@/lib/api/endpoints';

export default function AdminDashboardPage(): JSX.Element {
  const jobsQuery = useQuery({
    queryKey: ['admin-jobs-dashboard'],
    queryFn: () => api.getAdminJobs({ page: 1, pageSize: 50 }),
  });

  const applicationsQuery = useQuery({
    queryKey: ['admin-applications-dashboard'],
    queryFn: () => api.getAdminApplications({ page: 1, pageSize: 50 }),
  });

  const jobs = jobsQuery.data?.items ?? [];
  const applications = applicationsQuery.data?.items ?? [];

  const pendingCount = applications.filter((application) => application.status === 'PENDING').length;

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Overview</p>
          <h1 className="mt-2 text-3xl font-black">Dashboard</h1>
        </div>
        <Link href="/admin/jobs/new" className="gradient-button rounded-full px-4 py-2 text-sm font-semibold text-white">
          Create Job
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Jobs" value={jobs.length} icon={<BriefcaseBusiness size={18} />} />
        <StatCard label="Total Applications" value={applications.length} icon={<ClipboardList size={18} />} />
        <StatCard label="Pending Reviews" value={pendingCount} icon={<Clock3 size={18} />} />
      </div>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="glass-card rounded-2xl p-5">
          <h2 className="text-lg font-semibold">Latest Jobs</h2>
          <div className="mt-4 space-y-3">
            {jobs.slice(0, 6).map((job) => (
              <div key={job.id} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <p className="font-medium text-zinc-100">{job.title}</p>
                <p className="text-xs text-zinc-500">
                  {job.department} - {job.type.replace('_', ' ')}
                </p>
              </div>
            ))}
            {!jobs.length ? (
              <EmptyState
                title="No jobs yet"
                description="Create your first role to start receiving applications."
                actionHref="/admin/jobs/new"
                actionLabel="Create Job"
              />
            ) : null}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h2 className="text-lg font-semibold">Latest Applications</h2>
          <div className="mt-4 space-y-3">
            {applications.slice(0, 6).map((application) => (
              <div key={application.id} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <p className="font-medium text-zinc-100">{application.candidateName}</p>
                <p className="text-xs text-zinc-500">
                  {application.job?.title ?? 'Role unavailable'} - {application.status}
                </p>
              </div>
            ))}
            {!applications.length ? (
              <EmptyState
                title="No applications yet"
                description="Applications will appear here as candidates apply."
              />
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
