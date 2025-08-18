import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';
import { withUserAuth } from '../../../lib/auth-utils';
import { Result, succeed, fail } from '../../../lib/result';

export const dynamic = 'force-dynamic';

// Returns YYYY-MM-DD in UTC for stable, timezone-agnostic comparisons
function toUTCDateKey(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Returns day difference based on UTC date keys
function diffDaysUTC(a: Date, b: Date): number {
  const utcA = Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate());
  const utcB = Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate());
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.floor((utcA - utcB) / MS_PER_DAY);
}

async function processCheckin(
  userId: string
): Promise<Result<NextResponse, string>> {
  try {
    // Always use the current date for check-ins to prevent manipulation
    const now = new Date();
    const checkInDate = now; // do not trust client-provided date

    // Get current app state
    let appState = await prisma.appState.findUnique({
      where: { user_id: userId },
    });

    if (!appState) {
      appState = await prisma.appState.create({
        data: {
          user_id: userId,
          streak: 0,
          focus: [],
        },
      });
    }

    // If already checked in today (by UTC date), return early with no change
    if (appState.last_check_in) {
      const last = new Date(appState.last_check_in);
      if (toUTCDateKey(checkInDate) === toUTCDateKey(last)) {
        return succeed(
          NextResponse.json({
            message: 'Already checked in today!',
            streak: appState.streak,
            last_check_in: appState.last_check_in,
            alreadyCheckedIn: true,
          })
        );
      }
    }

    // Compute new streak using UTC-based day difference
    const lastCheckIn = appState.last_check_in
      ? new Date(appState.last_check_in)
      : null;
    let newStreak = appState.streak;
    let daysDiff = 0;

    if (lastCheckIn) {
      daysDiff = diffDaysUTC(checkInDate, lastCheckIn);
      if (daysDiff === 1) {
        newStreak = appState.streak + 1; // consecutive day
      } else if (daysDiff > 1) {
        newStreak = 1; // break in streak
      }
      // daysDiff === 0 handled above
    } else {
      newStreak = 1; // first-ever check-in
    }

    // Persist updated streak and last_check_in (as Date)
    const updatedAppState = await prisma.appState.update({
      where: { user_id: userId },
      data: {
        streak: newStreak,
        last_check_in: checkInDate,
      },
    });

    return succeed(
      NextResponse.json({
        message:
          daysDiff === 1 ? 'Streak continued! +1 day' : 'New streak started!',
        streak: newStreak,
        last_check_in: updatedAppState.last_check_in,
        alreadyCheckedIn: false,
        streakIncremented: daysDiff === 1,
        streakReset: daysDiff > 1,
      })
    );
  } catch (error) {
    console.error('Error processing check-in:', error);
    return fail('Failed to process check-in');
  }
}

export const POST = withUserAuth(processCheckin);
