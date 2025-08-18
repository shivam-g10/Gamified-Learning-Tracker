'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/app/header';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: ReactNode }) {
	return (
		<SessionProvider>
			<AuthProvider>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<Header />
					<main className="container-narrow py-6 text-foreground">{children}</main>
					<footer className="container-narrow py-8 text-sm text-muted-foreground bg-background">
						Built with Next.js + Postgres + Docker
					</footer>
					<Toaster />
				</ThemeProvider>
			</AuthProvider>
		</SessionProvider>
	);
}
