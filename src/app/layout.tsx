import '@/app/globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Senior Gamified Tracker',
  description: 'Gamified learning tracker',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <header className="border-b border-neutral-800">
          <div className="container-narrow py-4 flex items-center justify-between">
            <h1 className="text-lg font-semibold">CS → Senior Gamified Tracker</h1>
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


