import { cn } from '@/lib/utils';

type Status = 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED';

const statusClasses: Record<Status, string> = {
  PENDING: 'border-amber-500/30 bg-amber-500/15 text-amber-300',
  REVIEWED: 'border-blue-500/30 bg-blue-500/15 text-blue-300',
  SHORTLISTED: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300',
  REJECTED: 'border-rose-500/30 bg-rose-500/15 text-rose-300',
};

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps): JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide',
        statusClasses[status],
      )}
    >
      {status}
    </span>
  );
}
