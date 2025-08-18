import { withAuth } from 'next-auth/middleware';

export default withAuth(
  // Function that runs after authentication
  function middleware() {
    // Add any additional middleware logic here if needed
  },
  {
    // Callbacks for authentication
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  // Protect all API routes except auth-related ones
  matcher: [
    '/api/((?!auth).*)',
    '/home/:path*',
  ],
};
