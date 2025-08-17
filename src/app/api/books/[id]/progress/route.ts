import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }

    // Check if book exists
    const book = await prisma.book.findUnique({
      where: { id },
    });
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // Get progress history using Prisma
    const progressEntries = await prisma.bookProgressEntry.findMany({
      where: { book_id: id },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({
      success: true,
      book,
      progressEntries,
    });
  } catch (error) {
    console.error('Error fetching book progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch book progress' },
      { status: 500 }
    );
  }
}
