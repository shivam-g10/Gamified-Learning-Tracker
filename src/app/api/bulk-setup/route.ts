import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { BulkSetupService } from '@/services/bulk-setup-service';
import type { BulkSetupData } from '@/lib/api-types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data, replace } = body as {
      type: 'quests' | 'books' | 'courses';
      data: BulkSetupData[];
      replace?: boolean;
    };

    if (!type || !data || !Array.isArray(data)) {
      return NextResponse.json(
        { error: 'Invalid payload. Expected type and data array.' },
        { status: 400 }
      );
    }

    // Validate the data using the service
    const validationResult = BulkSetupService.validateBulkSetupData(data, type);
    if (validationResult._tag === 'Failure') {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }

    const validation = validationResult.data;
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.errors,
          warnings: validation.warnings,
        },
        { status: 400 }
      );
    }

    let result;
    let count = 0;

    switch (type) {
      case 'quests':
        // Clear existing quests if replace mode
        if (replace !== false) {
          await prisma.quest.deleteMany();
        }

        // Create new quests
        result = await prisma.quest.createMany({
          data: data.map((quest: BulkSetupData) => ({
            title: quest.title,
            xp: quest.xp || 0,
            type: (quest.type === 'project' || quest.type === 'bonus'
              ? quest.type
              : 'topic') as 'topic' | 'project' | 'bonus',
            category: quest.category,
            done: quest.done || false,
          })),
        });
        count = result.count;
        break;

      case 'books':
        // Clear existing books if replace mode
        if (replace !== false) {
          await prisma.book.deleteMany();
        }

        // Create new books
        result = await prisma.book.createMany({
          data: data.map((book: BulkSetupData) => ({
            title: book.title,
            author: book.author,
            total_pages: book.total_pages || 0,
            current_page: book.current_page || 0,
            status: (book.status === 'reading' || book.status === 'finished'
              ? book.status
              : 'backlog') as 'backlog' | 'reading' | 'finished',
            description: book.description,
            category: book.category || 'Uncategorized',
            tags: book.tags || [],
          })),
        });
        count = result.count;
        break;

      case 'courses':
        // Clear existing courses if replace mode
        if (replace !== false) {
          await prisma.course.deleteMany();
        }

        // Create new courses
        result = await prisma.course.createMany({
          data: data.map((course: BulkSetupData) => ({
            title: course.title,
            platform: course.platform,
            url: course.url,
            total_units: course.total_units || 0,
            completed_units: course.completed_units || 0,
            status: (course.status === 'learning' ||
            course.status === 'finished'
              ? course.status
              : 'backlog') as 'backlog' | 'learning' | 'finished',
            description: course.description,
            category: course.category || 'Uncategorized',
            tags: course.tags || [],
          })),
        });
        count = result.count;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid type. Must be one of: quests, books, courses' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully created ${count} ${type}`,
      count,
      type,
    });
  } catch (error) {
    console.error('Bulk setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
