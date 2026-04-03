'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { EmptyState } from '@/components/ui/empty-state';
import { api } from '@/lib/api/endpoints';

export default function JobDetailPage(): JSX.Element {
  const params = useParams<{ id: string }>();
  const jobId = params.id;

  const jobQuery = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => api.getJobById(jobId),
    enabled: Boolean(jobId),
  });

  if (jobQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10 md:px-8">
        <div className="glass-card shimmer rounded-2xl p-8">
          <div className="h-6 w-1/3 rounded bg-white/10" />
          <div className="mt-3 h-10 w-2/3 rounded bg-white/10" />
          <div className="mt-8 h-4 w-full rounded bg-white/10" />
          <div className="mt-2 h-4 w-5/6 rounded bg-white/10" />
          <div className="mt-10 h-11 w-40 rounded-full bg-white/10" />
        </div>
      </div>
    );
  }

  if (!jobQuery.data) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10 md:px-8">
        <EmptyState
          title="Job not found"
          description="This role is unavailable or may have been closed."
          actionHref="/jobs"
          actionLabel="Back To Jobs"
        />
      </div>
    );
  }

  const job = jobQuery.data;

  return (
    <motion.div
      className="mx-auto w-full max-w-4xl px-4 py-10 md:px-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <article className="glass-card rounded-2xl p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{job.department}</p>
        <h1 className="mt-3 text-3xl font-black md:text-5xl">{job.title}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-400">
          <span className="inline-flex items-center gap-2">
            <MapPin size={16} /> {job.location}
          </span>
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
            {job.type.replace('_', ' ')}
          </span>
        </div>

        <div className="mt-8 text-sm leading-7 text-zinc-300">{job.description}</div>

        <h2 className="mt-8 text-lg font-semibold">Requirements</h2>
        <ul className="mt-3 space-y-2 text-sm text-zinc-300">
          {job.requirements.map((requirement) => (
            <li key={requirement} className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400" />
              <span>{requirement}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex gap-3">
          <Link href={`/jobs/${job.id}/apply`} className="gradient-button rounded-full px-6 py-3 text-sm font-semibold text-white">
            Apply Now
          </Link>
          <Link href="/jobs" className="rounded-full border border-white/10 px-6 py-3 text-sm text-zinc-300">
            Back
          </Link>
        </div>
      </article>
    </motion.div>
  );
}
