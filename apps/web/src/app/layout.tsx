import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SiteShell } from '@/components/layout/site-shell';
import { AppProviders } from '@/components/providers/app-providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Unizoy Job Board',
  description: 'Find your next role at Unizoy',
  icons: {
    icon: 'https://www.unizoy.com/meta/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="min-h-screen bg-background text-zinc-100 antialiased">
        <AppProviders>
          <SiteShell>{children}</SiteShell>
        </AppProviders>
      </body>
    </html>
  );
}
