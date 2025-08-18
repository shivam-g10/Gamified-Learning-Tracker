import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';
import { withUserAuth } from '../../../lib/auth-utils';
import { Result, succeed, fail } from '../../../lib/result';

export const dynamic = 'force-dynamic';

async function getAppState(
  userId: string
): Promise<Result<NextResponse, string>> {
  try {
    let appState = await prisma.appState.findUnique({
      where: { user_id: userId },
    });

    if (!appState) {
      // Create default app state for the user if it doesn't exist
      appState = await prisma.appState.upsert({
        where: { user_id: userId },
        update: {},
        create: {
          user_id: userId,
          streak: 0,
          focus: [],
        },
      });
    }

    return succeed(NextResponse.json(appState));
  } catch (error) {
    console.error('Error fetching app state:', error);
    return fail('Failed to fetch app state');
  }
}

async function updateAppState(
  userId: string,
  req: NextRequest
): Promise<Result<NextResponse, string>> {
  try {
    const body = await req.json();
    const { streak, last_check_in, focus } = body || {};

    const appState = await prisma.appState.upsert({
      where: { user_id: userId },
      update: {
        streak: streak !== undefined ? streak : undefined,
        last_check_in: last_check_in !== undefined ? last_check_in : undefined,
        focus: focus !== undefined ? focus : undefined,
      },
      create: {
        user_id: userId,
        streak: streak || 0,
        last_check_in: last_check_in || null,
        focus: focus || [],
      },
    });

    return succeed(NextResponse.json(appState));
  } catch (error) {
    console.error('Error updating app state:', error);
    return fail('Failed to update app state');
  }
}

export const GET = withUserAuth(getAppState);
export const PUT = withUserAuth(updateAppState);
