import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';
import { withUserAuth } from '../../../lib/auth-utils';
import { Result, succeed, fail } from '../../../lib/result';
import type { Quest, Book, Course } from '@prisma/client';

export const dynamic = 'force-dynamic';

async function processBulkSetup(
  userId: string,
  req: NextRequest
): Promise<Result<NextResponse, string>> {
  try {
    const body = await req.json();
    const { quests, books, courses } = body || {};

    const results = {
      quests: [] as Quest[],
      books: [] as Book[],
      courses: [] as Course[],
    };

    // Create quests
    if (quests && Array.isArray(quests)) {
      for (const quest of quests) {
        const { title, description, xp, type, category } = quest;
        if (title && typeof xp === 'number' && xp >= 0 && type && category) {
          const createdQuest = await prisma.quest.create({
            data: {
              title,
              description,
              xp,
              type,
              category,
              user_id: userId,
            },
          });
          results.quests.push(createdQuest);
        }
      }
    }

    // Create books
    if (books && Array.isArray(books)) {
      for (const book of books) {
        const { title, author, total_pages, description, category, tags } =
          book;
        if (title) {
          const createdBook = await prisma.book.create({
            data: {
              title,
              author,
              total_pages: total_pages || 0,
              description,
              category: category || 'Uncategorized',
              tags: tags || [],
              user_id: userId,
            },
          });
          results.books.push(createdBook);
        }
      }
    }

    // Create courses
    if (courses && Array.isArray(courses)) {
      for (const course of courses) {
        const {
          title,
          platform,
          url,
          total_units,
          description,
          category,
          tags,
        } = course;
        if (title) {
          const createdCourse = await prisma.course.create({
            data: {
              title,
              platform,
              url,
              total_units: total_units || 0,
              description,
              category: category || 'Uncategorized',
              tags: tags || [],
              user_id: userId,
            },
          });
          results.courses.push(createdCourse);
        }
      }
    }

    return succeed(
      NextResponse.json({
        message: 'Bulk setup completed successfully',
        results,
      })
    );
  } catch (error) {
    console.error('Error in bulk setup:', error);
    return fail('Failed to complete bulk setup');
  }
}

export const POST = withUserAuth(processBulkSetup);
