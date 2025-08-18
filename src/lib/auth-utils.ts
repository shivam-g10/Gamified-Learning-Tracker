import { NextRequest, NextResponse } from 'next/server';
import { Result, succeed, fail } from './result';

/**
 * Extracts the user ID from the request headers
 * This function is used in API routes to get the authenticated user's ID
 * The middleware automatically adds the user ID to the x-user-id header
 *
 * @param req - The Next.js request object
 * @returns Result containing the user ID or an error
 */
export function getUserIdFromRequest(req: NextRequest): Result<string, string> {
  const userId = req.headers.get('x-user-id');
  if (!userId) {
    return fail('User ID not found in request headers');
  }
  return succeed(userId);
}

/**
 * Extracts the user ID from the request headers and returns a 401 error if not found
 * This function is used in API routes where user ID is required
 *
 * @param req - The Next.js request object
 * @returns Result containing the user ID or a NextResponse with 401 status
 */
export function requireUserIdFromRequest(
  req: NextRequest
): Result<string, NextResponse> {
  const userIdResult = getUserIdFromRequest(req);
  if (userIdResult._tag === 'Failure') {
    // Redirect to root page instead of returning 401
    return fail(NextResponse.redirect(new URL('/', req.url)));
  }
  return succeed(userIdResult.data);
}

/**
 * Wraps an API handler to ensure proper error handling using the Result pattern
 * This function catches errors and returns proper HTTP responses
 *
 * @param handler - The API handler function that returns a Result
 * @returns A wrapped handler that handles Results and converts them to HTTP responses
 */
export function withAuth<T extends readonly unknown[]>(
  handler: (
    req: NextRequest,
    ...args: T
  ) => Promise<Result<NextResponse, string>>
) {
  return async (req: NextRequest, ...args: T): Promise<NextResponse> => {
    try {
      const result = await handler(req, ...args);

      if (result._tag === 'Failure') {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      return result.data;
    } catch (error) {
      console.error('API error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Wraps an API handler that requires user authentication
 * This function ensures the user is authenticated before calling the handler
 *
 * @param handler - The API handler function that takes a user ID and request
 * @returns A wrapped handler that handles authentication and user ID extraction
 */
export function withUserAuth<T extends readonly unknown[]>(
  handler: (
    userId: string,
    req: NextRequest,
    ...args: T
  ) => Promise<Result<NextResponse, string>>
) {
  return async (req: NextRequest, ...args: T): Promise<NextResponse> => {
    try {
      const userIdResult = requireUserIdFromRequest(req);
      if (userIdResult._tag === 'Failure') {
        // This will be a redirect response, return it directly
        return userIdResult.error;
      }

      const result = await handler(userIdResult.data, req, ...args);

      if (result._tag === 'Failure') {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      return result.data;
    } catch (error) {
      console.error('API error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}
