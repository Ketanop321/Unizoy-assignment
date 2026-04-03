'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';

interface SiteShellProps {
  children: React.ReactNode;
}

export function SiteShell({ children }: SiteShellProps): JSX.Element {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 noise-layer opacity-[0.13]" />
      {!isAdminRoute ? <Navbar /> : null}
      <main className="relative z-10">{children}</main>
    </div>
  );
}
