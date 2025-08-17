import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { FocusState } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get the current focus state from the database
    const focusSlot = await prisma.focusSlot.findFirst();
    
    if (!focusSlot) {
      // Create a default focus slot if none exists
      await prisma.focusSlot.create({
        data: {
          quest_id: null,
          book_id: null,
          course_id: null,
        },
      });
      return NextResponse.json({
        quest: null,
        book: null,
        course: null,
      });
    }

    // Build the focus state by fetching the focused items
    const focusState: FocusState = {};

    if (focusSlot.quest_id) {
      const quest = await prisma.quest.findUnique({
        where: { id: focusSlot.quest_id },
      });
      if (quest) focusState.quest = quest;
    }

    if (focusSlot.book_id) {
      const book = await prisma.book.findUnique({
        where: { id: focusSlot.book_id },
      });
      if (book) focusState.book = book;
    }

    if (focusSlot.course_id) {
      const course = await prisma.course.findUnique({
        where: { id: focusSlot.course_id },
      });
      if (course) focusState.course = course;
    }

    return NextResponse.json(focusState);
  } catch (error) {
    console.error('Failed to get focus state:', error);
    return NextResponse.json(
      { error: 'Failed to get focus state' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { type, id, action } = await request.json();

    if (!type || !['quest', 'book', 'course'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid focus type' },
        { status: 400 }
      );
    }

    let focusState: FocusState;

    if (action === 'remove') {
      // Remove focus from the specified type
      await prisma.focusSlot.updateMany({
        data: { [`${type}_id`]: null },
      });
      
      // Return empty focus state for this type
      focusState = { [type]: null };
    } else {
      if (!id) {
        return NextResponse.json(
          { error: 'ID is required for setting focus' },
          { status: 400 }
        );
      }

      // Set focus for the specified type
      await prisma.focusSlot.updateMany({
        data: { [`${type}_id`]: id },
      });

      // Fetch the focused item
      let focusedItem;
      if (type === 'quest') {
        focusedItem = await prisma.quest.findUnique({ where: { id } });
      } else if (type === 'book') {
        focusedItem = await prisma.book.findUnique({ where: { id } });
      } else if (type === 'course') {
        focusedItem = await prisma.course.findUnique({ where: { id } });
      }

      focusState = { [type]: focusedItem };
    }

    return NextResponse.json(focusState);
  } catch (error) {
    console.error('Failed to update focus:', error);
    return NextResponse.json(
      { error: 'Failed to update focus' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Clear all focus
    await prisma.focusSlot.updateMany({
      data: {
        quest_id: null,
        book_id: null,
        course_id: null,
      },
    });

    return NextResponse.json({
      quest: null,
      book: null,
      course: null,
    });
  } catch (error) {
    console.error('Failed to clear focus:', error);
    return NextResponse.json(
      { error: 'Failed to clear focus' },
      { status: 500 }
    );
  }
}
