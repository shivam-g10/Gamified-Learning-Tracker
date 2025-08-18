import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    if (!type || !data || !Array.isArray(data)) {
      return NextResponse.json(
        { error: 'Invalid payload. Expected type and data array.' },
        { status: 400 }
      );
    }

    let result;
    let count = 0;

    switch (type) {
      case 'quests':
        // Clear existing quests first
        await prisma.quest.deleteMany();
        
        // Create new quests
        result = await prisma.quest.createMany({
          data: data.map((quest: { title: string; xp: number; type: 'topic' | 'project' | 'bonus'; category: string; done?: boolean }) => ({
            title: quest.title,
            xp: quest.xp,
            type: quest.type,
            category: quest.category,
            done: quest.done || false,
          })),
        });
        count = result.count;
        break;

      case 'books':
        // Clear existing books first
        await prisma.book.deleteMany();
        
        // Create new books
        result = await prisma.book.createMany({
          data: data.map((book: { title: string; author?: string; total_pages?: number; current_page?: number; status?: 'backlog' | 'reading' | 'finished'; description?: string; category?: string; tags?: string[] }) => ({
            title: book.title,
            author: book.author,
            total_pages: book.total_pages || 0,
            current_page: book.current_page || 0,
            status: book.status || 'backlog',
            description: book.description,
            category: book.category || 'Uncategorized',
            tags: book.tags || [],
          })),
        });
        count = result.count;
        break;

      case 'courses':
        // Clear existing courses first
        await prisma.course.deleteMany();
        
        // Create new courses
        result = await prisma.course.createMany({
          data: data.map((course: { title: string; platform?: string; url?: string; total_units?: number; completed_units?: number; status?: 'backlog' | 'learning' | 'finished'; description?: string; category?: string; tags?: string[] }) => ({
            title: course.title,
            platform: course.platform,
            url: course.url,
            total_units: course.total_units || 0,
            completed_units: course.completed_units || 0,
            status: course.status || 'backlog',
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
