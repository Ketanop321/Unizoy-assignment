'use client';

import { BriefcaseBusiness, LayoutDashboard, LogOut, FileText } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { cn } from '@/lib/utils';

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/jobs', label: 'Jobs', icon: BriefcaseBusiness },
  { href: '/admin/applications', label: 'Applications', icon: FileText },
];

export function AdminSidebar(): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside className="glass-card h-fit rounded-2xl p-4 md:sticky md:top-24">
      <div className="mb-6 px-2">
        <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Admin Panel</p>
        <h2 className="mt-2 text-lg font-semibold text-zinc-100">Unizoy Console</h2>
      </div>

      <div className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all',
                isActive
                  ? 'bg-gradient-to-r from-[#7C3AED]/25 to-[#06B6D4]/25 text-zinc-100'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100',
              )}
            >
              <Icon size={16} className={cn(isActive ? 'text-cyan-300' : 'text-zinc-500')} />
              {link.label}
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        className="mt-6 flex w-full items-center gap-3 rounded-xl border border-white/10 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5"
        onClick={async () => {
          await logout();
          router.push('/admin/login');
          router.refresh();
        }}
      >
        <LogOut size={16} />
        Logout
      </button>
    </aside>
  );
}
