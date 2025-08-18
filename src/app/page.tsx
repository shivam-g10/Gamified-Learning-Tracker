'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function RootPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    if (session) {
      // User is authenticated, redirect to home
      router.push('/home');
    } else {
      // User is not authenticated, redirect to sign-in
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  // Show loading state while determining redirect
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">🎯</span>
          </div>
          <h1 className="text-2xl font-bold">GyaanQuest</h1>
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return null;
}
