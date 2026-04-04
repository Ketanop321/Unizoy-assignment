'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { cn } from '@/lib/utils';

const adminQuickLinks = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/jobs', label: 'Jobs' },
  { href: '/admin/applications', label: 'Applications' },
  { href: '/admin/jobs/new', label: 'New Job' },
  { href: '/jobs', label: 'Public Jobs' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleBack = (): void => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }

    if (pathname.startsWith('/admin/jobs')) {
      router.push('/admin/jobs');
      return;
    }

    if (pathname.startsWith('/admin/applications')) {
      router.push('/admin/applications');
      return;
    }

    router.push('/admin/dashboard');
  };

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 md:grid-cols-[260px_1fr] md:px-8">
      <AdminSidebar />
      <section className="min-w-0">
        <div className="mb-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition hover:bg-white/10"
          >
            <ArrowLeft size={14} />
            Back
          </button>

          <Link
            href="/jobs"
            className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:bg-white/10"
          >
            Public Jobs
          </Link>
        </div>

        <nav className="glass-card mb-4 flex flex-wrap gap-2 rounded-2xl p-3 md:hidden">
          {adminQuickLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href.startsWith('/admin') && pathname.startsWith(`${link.href}/`));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-semibold transition',
                  isActive
                    ? 'border-cyan-400/40 bg-cyan-400/15 text-cyan-200'
                    : 'border-white/10 text-zinc-300 hover:bg-white/10',
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        {children}
      </section>
    </div>
  );
}
