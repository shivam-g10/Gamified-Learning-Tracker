import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  // Function that runs after authentication
  function middleware(req) {
    // Extract user ID from the token and add it to headers
    const token = req.nextauth.token;
    if (token?.sub) {
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-user-id', token.sub);

      // Return the request with the user ID header
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    // If no valid token, redirect to root
    return NextResponse.redirect(new URL('/', req.url));
  },
  {
    // Callbacks for authentication
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    // Redirect to root page when authentication fails
    pages: {
      signIn: '/',
    },
  }
);

export const config = {
  // Protect all API routes except auth-related ones
  matcher: ['/api/((?!auth).*)', '/home/:path*'],
};
