'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function RootPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.user?.id) {
      // User is authenticated and has a valid user ID, redirect to home
      router.push('/home');
    } else {
      // User is not authenticated or session is invalid, show sign-in
      // Don't redirect, just stay on root page
    }
  }, [session, status, router]);

  // Show loading state while determining redirect
  if (status === 'loading') {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center space-y-4'>
          <div className='w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto'>
            <span className='text-2xl'>🎯</span>
          </div>
          <h1 className='text-2xl font-bold'>GyaanQuest</h1>
          <div className='w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto' />
          <p className='text-muted-foreground'>Loading...</p>
        </div>
      </div>
    );
  }

  // Show sign-in interface when not authenticated
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='text-center space-y-6 p-8'>
        <div className='w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto'>
          <span className='text-4xl'>🎯</span>
        </div>
        <div className='space-y-4'>
          <h1 className='text-4xl font-bold'>GyaanQuest</h1>
          <p className='text-xl text-muted-foreground max-w-md'>
            Your personal learning journey tracker. Sign in to start building
            your quest for knowledge.
          </p>
        </div>
        <div className='pt-4'>
          <a
            href='/auth/signin'
            className='inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors'
          >
            Continue with Google
          </a>
        </div>
      </div>
    </div>
  );
}
