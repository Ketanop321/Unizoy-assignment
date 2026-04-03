'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { JobCard } from '@/components/ui/job-card';
import { JobCardSkeleton } from '@/components/ui/skeletons';
import { api } from '@/lib/api/endpoints';
import { pageEnter, staggerContainer } from '@/lib/motion/variants';

const filters = ['ALL', 'FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT'] as const;

export default function HomePage(): JSX.Element {
  const [search, setSearch] = useState('');
  const [type, setType] = useState<(typeof filters)[number]>('ALL');

  const queryParams = useMemo(
    () => ({
      page: 1,
      pageSize: 6,
      search: search || undefined,
      type: type === 'ALL' ? undefined : type,
    }),
    [search, type],
  );

  const jobsQuery = useQuery({
    queryKey: ['home-jobs', queryParams],
    queryFn: () => api.getJobs(queryParams),
  });

  return (
    <motion.div
      variants={pageEnter}
      initial="initial"
      animate="animate"
      className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8"
    >
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-8 md:p-12">
        <div className="absolute -left-24 top-0 h-64 w-64 animate-blob rounded-full bg-purple-500/25 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-64 w-64 animate-blob rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Unizoy Careers</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
            Find Your Next Role at <span className="gradient-text">Unizoy</span>
          </h1>
          <p className="mt-5 max-w-2xl text-zinc-400">
            Ship AI products fast without compromise. Explore engineering, infrastructure, and operations
            opportunities built for high-impact teams.
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-3">
            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3">
              <Search size={18} className="text-zinc-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
                placeholder="Search roles, skills..."
              />
            </label>

            <div className="mt-3 flex flex-wrap gap-2">
              {filters.map((filterType) => (
                <button
                  key={filterType}
                  type="button"
                  onClick={() => setType(filterType)}
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
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Open Positions</p>
            <h2 className="mt-2 text-2xl font-bold">Featured Opportunities</h2>
          </div>
        </div>

        {jobsQuery.isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <JobCardSkeleton key={index} />
            ))}
          </div>
        ) : jobsQuery.data?.items.length ? (
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {jobsQuery.data.items.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </motion.div>
        ) : (
          <EmptyState
            title="No matching roles found"
            description="Try a broader search or switch the role type filter."
            actionHref="/jobs"
            actionLabel="Browse All Jobs"
          />
        )}
      </section>
    </motion.div>
  );
}
