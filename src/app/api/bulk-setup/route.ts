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
    const { type, data, replace } = body || {};

    if (!type || !data || !Array.isArray(data)) {
      return fail('Invalid request: type and data array are required');
    }

    // Handle replace mode - delete existing items of the specified type
    if (replace) {
      switch (type) {
        case 'quests':
          await prisma.quest.deleteMany({ where: { user_id: userId } });
          break;
        case 'books':
          await prisma.book.deleteMany({ where: { user_id: userId } });
          break;
        case 'courses':
          await prisma.course.deleteMany({ where: { user_id: userId } });
          break;
        default:
          return fail('Invalid type specified');
      }
    }

    const results = {
      quests: [] as Quest[],
      books: [] as Book[],
      courses: [] as Course[],
    };

    // Create items based on type
    switch (type) {
      case 'quests':
        for (const item of data) {
          const { title, description, xp, type: questType, category } = item;
          if (
            title &&
            typeof xp === 'number' &&
            xp >= 0 &&
            questType &&
            category
          ) {
            const createdQuest = await prisma.quest.create({
              data: {
                title,
                description,
                xp,
                type: questType,
                category,
                user_id: userId,
              },
            });
            results.quests.push(createdQuest);
          }
        }
        break;

      case 'books':
        for (const item of data) {
          const { title, author, total_pages, description, category, tags } =
            item;
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
        break;

      case 'courses':
        for (const item of data) {
          const {
            title,
            platform,
            url,
            total_units,
            description,
            category,
            tags,
          } = item;
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
        break;

      default:
        return fail('Invalid type specified');
    }

    const totalCreated =
      results.quests.length + results.books.length + results.courses.length;

    return succeed(
      NextResponse.json({
        success: true,
        message: `Successfully created ${totalCreated} ${type}`,
        count: totalCreated,
        type,
      })
    );
  } catch (error) {
    console.error('Error in bulk setup:', error);
    return fail('Failed to complete bulk setup');
  }
}

export const POST = withUserAuth(processBulkSetup);
