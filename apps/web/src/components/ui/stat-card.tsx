'use client';

import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect } from 'react';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

export function StatCard({ label, value, icon }: StatCardProps): JSX.Element {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, { duration: 0.8, ease: 'easeOut' });
    return () => controls.stop();
  }, [count, value]);

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-4 inline-flex rounded-xl bg-gradient-to-r from-[#7C3AED]/40 to-[#06B6D4]/40 p-2 text-zinc-100">
        {icon}
      </div>
      <motion.p className="text-3xl font-bold text-zinc-100">{rounded}</motion.p>
      <p className="mt-2 text-sm text-zinc-400">{label}</p>
    </div>
  );
}
