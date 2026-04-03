'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { StatusBadge } from '@/components/ui/status-badge';
import { TableSkeletonRow } from '@/components/ui/skeletons';
import { api } from '@/lib/api/endpoints';
import { useToastStore } from '@/lib/store/toast-store';

const statuses = ['ALL', 'PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED'] as const;

export default function AdminApplicationsPage(): JSX.Element {
  const [status, setStatus] = useState<(typeof statuses)[number]>('ALL');
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.push);

  const queryParams = useMemo(
    () => ({
      page: 1,
      pageSize: 50,
      status: status === 'ALL' ? undefined : status,
      search: search || undefined,
    }),
    [search, status],
  );

  const applicationsQuery = useQuery({
    queryKey: ['admin-applications', queryParams],
    queryFn: () => api.getAdminApplications(queryParams),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, nextStatus }: { id: string; nextStatus: 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED' }) =>
      api.updateApplicationStatus(id, nextStatus),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
      pushToast({ title: 'Application status updated', variant: 'success' });
    },
  });

  const applications = applicationsQuery.data?.items ?? [];

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Admin Applications</p>
          <h1 className="mt-2 text-3xl font-black">Manage Applications</h1>
        </div>

        <div className="flex gap-2">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm"
            placeholder="Search name, email, role"
          />
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as (typeof statuses)[number])}
            className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm"
          >
            {statuses.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="glass-card overflow-hidden rounded-2xl">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wide text-zinc-400">
            <tr>
              <th className="px-4 py-3">Candidate</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Applied</th>
              <th className="px-4 py-3">Update</th>
            </tr>
          </thead>
          <tbody>
            {applicationsQuery.isLoading ?
              Array.from({ length: 5 }).map((_, index) => <TableSkeletonRow key={index} />)
            : applications.map((application) => (
                <tr key={application.id} className="border-b border-white/10 odd:bg-black/20">
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-100">{application.candidateName}</p>
                    <p className="text-xs text-zinc-500">{application.candidateEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{application.job?.title ?? 'Unknown role'}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={application.status} />
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {new Date(application.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      defaultValue={application.status}
                      onChange={(event) => {
                        updateStatusMutation.mutate({
                          id: application.id,
                          nextStatus: event.target.value as 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED',
                        });
                      }}
                      className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="REVIEWED">REVIEWED</option>
                      <option value="SHORTLISTED">SHORTLISTED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
