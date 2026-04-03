'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 md:grid-cols-[260px_1fr] md:px-8">
      <AdminSidebar />
      <section className="min-w-0">
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
