import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { Quest, Book, Course } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get all available unfinished items
    const [unfinishedQuests, unfinishedBooks, unfinishedCourses] =
      await Promise.all([
        prisma.quest.findMany({ where: { done: false } }),
        prisma.book.findMany({ where: { status: { not: 'finished' } } }),
        prisma.course.findMany({ where: { status: { not: 'finished' } } }),
      ]);

    // Combine all items into a single array
    const allItems = [
      ...unfinishedQuests.map((quest: Quest) => ({
        id: quest.id,
        title: quest.title,
        type: 'quest' as const,
        category: quest.category,
        xp: quest.xp,
      })),
      ...unfinishedBooks.map((book: Book) => ({
        id: book.id,
        title: book.title,
        type: 'book' as const,
        category: book.category,
        xp: 50, // Default XP for books
      })),
      ...unfinishedCourses.map((course: Course) => ({
        id: course.id,
        title: course.title,
        type: 'course' as const,
        category: course.category,
        xp: 75, // Default XP for courses
      })),
    ];

    if (allItems.length === 0) {
      return NextResponse.json(null);
    }

    // Randomly select an item
    const randomIndex = Math.floor(Math.random() * allItems.length);
    const randomItem = allItems[randomIndex];

    return NextResponse.json(randomItem);
  } catch (error) {
    console.error('Error getting random challenge:', error);
    return NextResponse.json(
      { error: 'Failed to get random challenge' },
      { status: 500 }
    );
  }
}
