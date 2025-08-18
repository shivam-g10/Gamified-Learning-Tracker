import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';
import { withUserAuth } from '../../../lib/auth-utils';
import { Result, succeed, fail } from '../../../lib/result';

export const dynamic = 'force-dynamic';

async function getBooks(
  userId: string,
  req: NextRequest
): Promise<Result<NextResponse, string>> {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const category = searchParams.get('category') || undefined;

    const books = await prisma.book.findMany({
      where: {
        user_id: userId,
        AND: [
          search
            ? {
                OR: [
                  { title: { contains: search, mode: 'insensitive' } },
                  { author: { contains: search, mode: 'insensitive' } },
                  { category: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
          status
            ? { status: status as 'backlog' | 'reading' | 'finished' }
            : {},
          category
            ? { category: { equals: category, mode: 'insensitive' } }
            : {},
        ],
      },
      orderBy: { created_at: 'desc' },
    });

    return succeed(NextResponse.json(books));
  } catch (error) {
    console.error('Error fetching books:', error);
    return fail('Failed to fetch books');
  }
}

async function createBook(
  userId: string,
  req: NextRequest
): Promise<Result<NextResponse, string>> {
  try {
    const body = await req.json();
    const { title, author, total_pages, description, category, tags } =
      body || {};

    if (!title) {
      return fail('Title is required');
    }

    const book = await prisma.book.create({
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

    return succeed(NextResponse.json(book, { status: 201 }));
  } catch (error) {
    console.error('Error creating book:', error);
    return fail('Failed to create book');
  }
}

export const GET = withUserAuth(getBooks);
export const POST = withUserAuth(createBook);
