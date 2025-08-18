import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';
import { withUserAuth } from '../../../lib/auth-utils';
import { Result, succeed, fail } from '../../../lib/result';

export const dynamic = 'force-dynamic';

async function generateRandomChallenge(
  userId: string
): Promise<Result<NextResponse, string>> {
  try {
    // Get current focus state to check available slots
    const focusSlot = await prisma.focusSlot.findUnique({
      where: { user_id: userId },
    });

    // Resolve actual focused entities to avoid stale IDs
    const [focusedQuest, focusedBook, focusedCourse] = await Promise.all([
      focusSlot?.quest_id
        ? prisma.quest.findUnique({ where: { id: focusSlot.quest_id } })
        : null,
      focusSlot?.book_id
        ? prisma.book.findUnique({ where: { id: focusSlot.book_id } })
        : null,
      focusSlot?.course_id
        ? prisma.course.findUnique({ where: { id: focusSlot.course_id } })
        : null,
    ]);

    // Determine which types can be added to focus based on actual entities
    const availableTypes: Array<'quest' | 'book' | 'course'> = [];

    if (!focusedQuest) {
      availableTypes.push('quest');
    }
    if (!focusedBook) {
      availableTypes.push('book');
    }
    if (!focusedCourse) {
      availableTypes.push('course');
    }

    // If all focus slots are full, return appropriate message
    if (availableTypes.length === 0) {
      return succeed(
        NextResponse.json({
          message:
            'All focus slots are full. Complete or remove items from focus to get new challenges.',
          challenge: null,
          focusSlotsFull: true,
        })
      );
    }

    // Randomly select an available type
    const selectedType =
      availableTypes[Math.floor(Math.random() * availableTypes.length)];

    let challenge: {
      id: string;
      title: string;
      type: 'quest' | 'book' | 'course';
      category: string;
      xp: number;
    } | null = null;

    switch (selectedType) {
      case 'quest':
        const quests = await prisma.quest.findMany({
          where: {
            user_id: userId,
            done: false,
          },
          orderBy: { created_at: 'desc' },
        });

        if (quests.length > 0) {
          const randomQuest = quests[Math.floor(Math.random() * quests.length)];
          challenge = {
            id: randomQuest.id,
            title: randomQuest.title,
            type: 'quest' as const,
            category: randomQuest.category,
            xp: randomQuest.xp,
          };
        }
        break;

      case 'book':
        const books = await prisma.book.findMany({
          where: {
            user_id: userId,
            status: { not: 'finished' },
          },
          orderBy: { created_at: 'desc' },
        });

        if (books.length > 0) {
          const randomBook = books[Math.floor(Math.random() * books.length)];
          challenge = {
            id: randomBook.id,
            title: randomBook.title,
            type: 'book' as const,
            category: randomBook.category,
            xp: 50, // Default XP for book challenges
          };
        }
        break;

      case 'course':
        const courses = await prisma.course.findMany({
          where: {
            user_id: userId,
            status: { not: 'finished' },
          },
          orderBy: { created_at: 'desc' },
        });

        if (courses.length > 0) {
          const randomCourse =
            courses[Math.floor(Math.random() * courses.length)];
          challenge = {
            id: randomCourse.id,
            title: randomCourse.title,
            type: 'course' as const,
            category: randomCourse.category,
            xp: 75, // Default XP for course challenges
          };
        }
        break;
    }

    if (!challenge) {
      return succeed(
        NextResponse.json({
          message: `No available ${selectedType}s for random challenge`,
          challenge: null,
          focusSlotsFull: false,
        })
      );
    }

    return succeed(
      NextResponse.json({
        challenge,
        focusSlotsFull: false,
      })
    );
  } catch (error) {
    console.error('Error generating random challenge:', error);
    return fail('Failed to generate random challenge');
  }
}

export const GET = withUserAuth(generateRandomChallenge);
