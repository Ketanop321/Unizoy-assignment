'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { EmptyState } from '@/components/ui/empty-state';
import { TableSkeletonRow } from '@/components/ui/skeletons';
import { api } from '@/lib/api/endpoints';
import { useToastStore } from '@/lib/store/toast-store';

export default function AdminJobsPage(): JSX.Element {
  const [search, setSearch] = useState('');
  const pushToast = useToastStore((state) => state.push);
  const queryClient = useQueryClient();

  const queryParams = useMemo(
    () => ({
      page: 1,
      pageSize: 100,
      search: search || undefined,
    }),
    [search],
  );

  const jobsQuery = useQuery({
    queryKey: ['admin-jobs', queryParams],
    queryFn: () => api.getAdminJobs(queryParams),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteJob(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      pushToast({ title: 'Job deactivated', variant: 'success' });
    },
    onError: () => {
      pushToast({ title: 'Failed to deactivate job', variant: 'error' });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => api.updateJob(id, { isActive }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      pushToast({ title: 'Job status updated', variant: 'success' });
    },
  });

  const jobs = jobsQuery.data?.items ?? [];

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Admin Jobs</p>
          <h1 className="mt-2 text-3xl font-black">Manage Jobs</h1>
        </div>

        <div className="flex gap-2">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title"
            className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm"
          />
          <Link href="/admin/jobs/new" className="gradient-button rounded-full px-4 py-2 text-sm font-semibold text-white">
            New Job
          </Link>
        </div>
      </div>

      <div className="glass-card overflow-hidden rounded-2xl">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wide text-zinc-400">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobsQuery.isLoading ?
              Array.from({ length: 5 }).map((_, index) => <TableSkeletonRow key={index} />)
            : jobs.map((job) => (
                <tr key={job.id} className="border-b border-white/10 odd:bg-black/20">
                  <td className="px-4 py-3 font-medium text-zinc-100">{job.title}</td>
                  <td className="px-4 py-3 text-zinc-400">{job.department}</td>
                  <td className="px-4 py-3 text-zinc-400">{job.type.replace('_', ' ')}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        job.isActive
                          ? 'border border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
                          : 'border border-zinc-500/30 bg-zinc-500/15 text-zinc-300'
                      }`}
                      onClick={() => toggleMutation.mutate({ id: job.id, isActive: !job.isActive })}
                    >
                      {job.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/jobs/${job.id}/edit`}
                        className="rounded-lg border border-white/10 p-2 text-zinc-300 transition hover:bg-white/10"
                        aria-label="Edit job"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => deleteMutation.mutate(job.id)}
                        className="rounded-lg border border-red-500/30 p-2 text-red-300 transition hover:bg-red-500/15"
                        aria-label="Delete job"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!jobsQuery.isLoading && jobs.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No jobs found"
            description="Create a new role or clear your search to view existing entries."
            actionHref="/admin/jobs/new"
            actionLabel="Create Job"
          />
        </div>
      ) : null}
    </div>
  );
}
