'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { signOut } from 'next-auth/react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted'>
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

  if (!isAuthenticated) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4'>
        <Card className='w-full max-w-md'>
          <CardHeader className='text-center space-y-4'>
            <div className='mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center'>
              <span className='text-2xl'>🔒</span>
            </div>
            <CardTitle className='text-2xl font-bold'>Access Denied</CardTitle>
            <p className='text-muted-foreground text-sm'>
              You need to be signed in to access this page.
            </p>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Button
              onClick={() => router.push('/auth/signin')}
              className='w-full'
            >
              Sign In
            </Button>
            <Button
              onClick={() => signOut()}
              variant='outline'
              className='w-full'
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
