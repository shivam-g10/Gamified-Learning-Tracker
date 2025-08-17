import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as
      | 'backlog'
      | 'reading'
      | 'finished'
      | undefined;
    const search = searchParams.get('search') || undefined;
    const tags = searchParams.get('tags')?.split(',') || undefined;

    const where: Record<string, unknown> = {};
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    const books = await prisma.book.findMany({
      where,
      orderBy: { updated_at: 'desc' },
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error('Failed to fetch books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, author, total_pages, category, description, tags } = body;

    // Validation
    if (
      !title ||
      typeof total_pages !== 'number' ||
      total_pages < 0 ||
      !category
    ) {
      return NextResponse.json(
        {
          error:
            'Invalid payload. Title, total_pages, and category are required.',
        },
        { status: 400 }
      );
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        total_pages,
        category,
        description,
        tags: tags || [],
        current_page: 0,
        status: 'backlog',
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error('Failed to create book:', error);
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    );
  }
}
