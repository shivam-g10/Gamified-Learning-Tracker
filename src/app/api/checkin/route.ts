import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';
import { withUserAuth } from '../../../lib/auth-utils';
import { Result, succeed, fail } from '../../../lib/result';

export const dynamic = 'force-dynamic';

async function processCheckin(
  userId: string,
  req: NextRequest
): Promise<Result<NextResponse, string>> {
  try {
    let body: { date?: string } = {};

    // Only try to parse JSON if there's content
    const contentType = req.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        body = await req.json();
      } catch {
        // If JSON parsing fails, use empty body
        body = {};
      }
    }

    const { date } = body;

    const checkInDate = date ? new Date(date) : new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    checkInDate.setHours(0, 0, 0, 0);

    // Get current app state
    let appState = await prisma.appState.findUnique({
      where: { user_id: userId },
    });

    if (!appState) {
      // Create default app state for the user if it doesn't exist
      appState = await prisma.appState.create({
        data: {
          user_id: userId,
          streak: 0,
          focus: [],
        },
      });
    }

    // Check if this is a consecutive day
    const lastCheckIn = appState.last_check_in;
    let newStreak = appState.streak;

    if (lastCheckIn) {
      const lastCheckInDate = new Date(lastCheckIn);
      lastCheckInDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor(
        (checkInDate.getTime() - lastCheckInDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 1) {
        // Consecutive day
        newStreak = appState.streak + 1;
      } else if (daysDiff > 1) {
        // Break in streak
        newStreak = 1;
      }
      // If daysDiff === 0, it's the same day, keep current streak
    } else {
      // First check-in
      newStreak = 1;
    }

    // Update app state
    const updatedAppState = await prisma.appState.update({
      where: { user_id: userId },
      data: {
        streak: newStreak,
        last_check_in: checkInDate,
      },
    });

    return succeed(
      NextResponse.json({
        message: 'Check-in successful',
        streak: newStreak,
        last_check_in: updatedAppState.last_check_in,
      })
    );
  } catch (error) {
    console.error('Error processing check-in:', error);
    return fail('Failed to process check-in');
  }
}

export const POST = withUserAuth(processCheckin);
