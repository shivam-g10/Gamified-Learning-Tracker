import '@/app/globals.css';
import { ReactNode } from 'react';
import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Gamified Learning Tracker',
  description: 'A full-stack gamified learning tracker built with Next.js and PostgreSQL. Track your learning progress with XP, levels, streaks, badges, and interactive quests.',
  keywords: ['learning', 'tracker', 'gamification', 'education', 'progress', 'XP', 'quests'],
  authors: [{ name: 'Gamified Learning Tracker Team' }],
  creator: 'Gamified Learning Tracker Team',
  publisher: 'Gamified Learning Tracker',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.svg',
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'no-verification-needed',
  },
  openGraph: {
    title: 'Gamified Learning Tracker',
    description: 'A full-stack gamified learning tracker built with Next.js and PostgreSQL',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Gamified Learning Tracker',
    description: 'A full-stack gamified learning tracker built with Next.js and PostgreSQL',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="bingbot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="slurp" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="duckduckbot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="baiduspider" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="yandex" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      </head>
      <body>
        <header className="border-b border-neutral-800">
          <div className="container-narrow py-4 flex items-center justify-between">
            <h1 className="text-lg font-semibold">CS → Gamified Learning Tracker</h1>
            <a className="chip" href="/health">Health</a>
          </div>
        </header>
        <main className="container-narrow py-6">{children}</main>
        <footer className="container-narrow py-8 text-sm text-neutral-400">
          Built with Next.js + Postgres + Docker
        </footer>
      </body>
    </html>
  );
}


