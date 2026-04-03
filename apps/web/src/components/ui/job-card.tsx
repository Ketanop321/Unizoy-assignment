import { motion } from 'framer-motion';
import { MapPin, Clock3 } from 'lucide-react';
import Link from 'next/link';
import type { Job } from '@/lib/api/types';
import { cn } from '@/lib/utils';

interface JobCardProps {
  job: Job;
}

const typeBadgeClass: Record<Job['type'], string> = {
  FULL_TIME: 'bg-violet-500/15 text-violet-300 border-violet-500/25',
  PART_TIME: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
  INTERNSHIP: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  CONTRACT: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
};

export function JobCard({ job }: JobCardProps): JSX.Element {
  return (
    <motion.article
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      }}
      className="glass-card group rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-glow"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">{job.department}</p>
          <h3 className="mt-2 text-lg font-semibold text-zinc-100">{job.title}</h3>
        </div>

        <span
          className={cn(
            'rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide',
            typeBadgeClass[job.type],
          )}
        >
          {job.type.replace('_', ' ')}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-zinc-400">{job.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
        <span className="inline-flex items-center gap-1">
          <MapPin size={14} /> {job.location}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock3 size={14} /> {new Date(job.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="text-xs text-zinc-500">Production-grade AI team</div>
        <Link
          href={`/jobs/${job.id}`}
          className="gradient-button rounded-full px-4 py-2 text-xs font-semibold text-white"
        >
          View & Apply
        </Link>
      </div>
    </motion.article>
  );
}
