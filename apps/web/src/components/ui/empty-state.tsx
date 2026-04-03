import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: EmptyStateProps): JSX.Element {
  return (
    <div className="glass-card mx-auto flex max-w-xl flex-col items-center rounded-2xl p-10 text-center">
      <div className="noise-layer mb-6 grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-white/5 text-2xl">
        *
      </div>
      <h3 className="text-xl font-semibold text-zinc-100">{title}</h3>
      <p className="mt-3 max-w-md text-sm text-zinc-400">{description}</p>
      {actionHref && actionLabel ?
        <Link href={actionHref} className="gradient-button mt-6 rounded-full px-5 py-2 text-sm font-semibold text-white">
          {actionLabel}
        </Link>
      : null}
    </div>
  );
}
