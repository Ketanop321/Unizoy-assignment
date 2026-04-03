'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'Home' },
  { href: '/jobs', label: 'Jobs' },
  { href: '/admin/dashboard', label: 'Admin' },
];

export function Navbar(): JSX.Element {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = (): void => {
      setScrolled(window.scrollY > 24);
    };

    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'sticky top-0 z-50 border-b px-4 py-4 backdrop-blur-xl transition-all md:px-8',
        scrolled ? 'border-white/10 bg-black/65' : 'border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          <Image src="https://www.unizoy.com/unizoy.svg" alt="Unizoy" width={120} height={32} priority />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm text-zinc-400 transition-colors hover:text-zinc-100',
                pathname === link.href && 'text-zinc-100',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/jobs"
          className="gradient-button rounded-full px-5 py-2 text-sm font-semibold text-white"
        >
          Explore Roles
        </Link>
      </div>
    </motion.header>
  );
}
