'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { JobCard } from '@/components/ui/job-card';
import { JobCardSkeleton } from '@/components/ui/skeletons';
import { api } from '@/lib/api/endpoints';

const filters = ['ALL', 'FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT'] as const;

export default function JobsPage(): JSX.Element {
  const [search, setSearch] = useState('');
  const [type, setType] = useState<(typeof filters)[number]>('ALL');
  const [page, setPage] = useState(1);

  const queryParams = useMemo(
    () => ({
      page,
      pageSize: 9,
      search: search || undefined,
      type: type === 'ALL' ? undefined : type,
    }),
    [page, search, type],
  );

  const jobsQuery = useQuery({
    queryKey: ['jobs', queryParams],
    queryFn: () => api.getJobs(queryParams),
  });

  const totalPages = jobsQuery.data?.pagination.totalPages ?? 1;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8">
      <div className="glass-card rounded-2xl p-4 md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Jobs</p>
            <h1 className="mt-1 text-2xl font-bold">All Open Roles</h1>
          </div>

          <label className="flex min-w-[260px] items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 py-2">
            <Search size={16} className="text-zinc-500" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search roles, skills..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {filters.map((filterType) => (
            <button
              key={filterType}
              type="button"
              onClick={() => {
                setType(filterType);
                setPage(1);
              }}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                type === filterType
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white'
                  : 'border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10'
              }`}
            >
              {filterType.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <section className="mt-6">
        {jobsQuery.isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <JobCardSkeleton key={index} />
            ))}
          </div>
        ) : jobsQuery.data?.items.length ? (
          <motion.div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {jobsQuery.data.items.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </motion.div>
        ) : (
          <EmptyState
            title="No jobs for this filter"
            description="There are no roles matching this criteria right now."
            actionHref="/"
            actionLabel="Back To Home"
          />
        )}
      </section>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => setPage((value) => Math.max(1, value - 1))}
          className="rounded-full border border-white/10 px-4 py-2 text-xs text-zinc-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-xs text-zinc-400">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
          className="rounded-full border border-white/10 px-4 py-2 text-xs text-zinc-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
