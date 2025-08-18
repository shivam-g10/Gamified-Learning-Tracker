import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';
import { withUserAuth } from '../../../lib/auth-utils';
import { Result, succeed, fail } from '../../../lib/result';

export const dynamic = 'force-dynamic';

async function generateRandomChallenge(
  userId: string
): Promise<Result<NextResponse, string>> {
  try {
    // Get all available quests for the user
    const quests = await prisma.quest.findMany({
      where: {
        user_id: userId,
        done: false,
      },
      orderBy: { created_at: 'desc' },
    });

    if (quests.length === 0) {
      return succeed(
        NextResponse.json({
          message: 'No available quests for random challenge',
          quest: null,
        })
      );
    }

    // Select a random quest
    const randomIndex = Math.floor(Math.random() * quests.length);
    const selectedQuest = quests[randomIndex];

    return succeed(
      NextResponse.json({
        quest: selectedQuest,
      })
    );
  } catch (error) {
    console.error('Error generating random challenge:', error);
    return fail('Failed to generate random challenge');
  }
}

export const GET = withUserAuth(generateRandomChallenge);
