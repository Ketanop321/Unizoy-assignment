export function JobCardSkeleton(): JSX.Element {
  return (
    <div className="glass-card shimmer rounded-2xl p-5">
      <div className="h-3 w-1/3 rounded bg-white/10" />
      <div className="mt-3 h-6 w-2/3 rounded bg-white/10" />
      <div className="mt-4 h-4 w-full rounded bg-white/10" />
      <div className="mt-2 h-4 w-5/6 rounded bg-white/10" />
      <div className="mt-6 h-9 w-28 rounded-full bg-white/10" />
    </div>
  );
}

export function TableSkeletonRow(): JSX.Element {
  return (
    <tr className="animate-pulse border-b border-white/10">
      <td className="px-4 py-4"><div className="h-4 w-32 rounded bg-white/10" /></td>
      <td className="px-4 py-4"><div className="h-4 w-24 rounded bg-white/10" /></td>
      <td className="px-4 py-4"><div className="h-4 w-28 rounded bg-white/10" /></td>
      <td className="px-4 py-4"><div className="h-8 w-20 rounded bg-white/10" /></td>
    </tr>
  );
}
