import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(
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

    const body = await req.json();
    const { from_page, to_page, notes } = body;

    if (
      !from_page ||
      !to_page ||
      typeof from_page !== 'number' ||
      typeof to_page !== 'number' ||
      from_page >= to_page
    ) {
      return NextResponse.json(
        {
          error:
            'Valid from_page and to_page are required (from_page < to_page)',
        },
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

    // Check if book is in focus for XP boost
    const focusSlot = await prisma.focusSlot.findFirst();
    const isInFocus = focusSlot?.book_id === id;

    // Calculate XP
    const pagesRead = to_page - from_page;
    const baseSessionXP = pagesRead * 10; // 10 XP per page
    const focusBoostXP = isInFocus ? Math.floor(baseSessionXP * 0.5) : 0; // 50% boost if in focus
    const sessionXP = baseSessionXP + focusBoostXP;

    // Check if book is finished
    const isFinished = to_page >= book.total_pages;
    const finishBonus = isFinished ? 100 : 0; // 100 XP bonus for finishing

    const totalXP = sessionXP + finishBonus;

    // Log progress entry
    await prisma.bookProgressEntry.create({
      data: {
        book_id: id,
        from_page,
        to_page,
        pages_read: pagesRead, // Store the calculated pages read
        notes: notes || null,
      },
    });

    // Update book current page
    const updatedBook = await prisma.book.update({
      where: { id },
      data: {
        current_page: Math.max(book.current_page, to_page),
        status: isFinished ? 'finished' : 'reading',
        updated_at: new Date(),
      },
    });

    // Note: XP tracking would need to be implemented in a separate table
    // For now, we'll just log the progress without XP tracking

    return NextResponse.json({
      success: true,
      book: updatedBook,
      xpEarned: totalXP,
      sessionXP: baseSessionXP,
      focusBoostXP,
      finishBonus,
      isFinished,
      isInFocus,
      pagesRead,
    });
  } catch (error) {
    console.error('Error logging book progress:', error);
    return NextResponse.json(
      { error: 'Failed to log book progress' },
      { status: 500 }
    );
  }
}
