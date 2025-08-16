import { NextRequest, NextResponse } from 'next/server';
import { BookService } from '@/services/book-service';
import { FocusService } from '@/services/focus-service';
import { XPService } from '@/services/xp-service';

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
    const book = await BookService.getBookById(id);
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // Check if book is in focus for XP boost
    const focusState = await FocusService.getFocusState();
    const isInFocus = focusState.book?.id === id;

    // Log progress and calculate XP with focus boost
    const result = await BookService.logProgress(
      id,
      {
        from_page,
        to_page,
        notes: notes || null,
      },
      isInFocus
    );

    // Calculate focus boost details for response
    const baseSessionXP = XPService.calculateBookSessionXP(
      to_page - from_page,
      false
    );
    const focusBoostXP = isInFocus
      ? result.xpEarned - baseSessionXP - result.finishBonus
      : 0;

    return NextResponse.json({
      success: true,
      book: result.book,
      xpEarned: result.xpEarned,
      sessionXP: baseSessionXP,
      focusBoostXP,
      finishBonus: result.finishBonus,
      isFinished: result.isFinished,
      isInFocus,
      pagesRead: to_page - from_page,
    });
  } catch (error) {
    console.error('Error logging book progress:', error);
    return NextResponse.json(
      { error: 'Failed to log book progress' },
      { status: 500 }
    );
  }
}
