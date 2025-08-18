import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';
import { withUserAuth } from '../../../lib/auth-utils';
import { Result, succeed, fail } from '../../../lib/result';

export const dynamic = 'force-dynamic';

async function getFocusSlot(
  userId: string
): Promise<Result<NextResponse, string>> {
  try {
    const focusSlot = await prisma.focusSlot.findUnique({
      where: { user_id: userId },
    });

    if (!focusSlot) {
      // Create default focus slot for the user if it doesn't exist
      await prisma.focusSlot.create({
        data: {
          user_id: userId,
          quest_id: null,
          book_id: null,
          course_id: null,
        },
      });

      // Return empty focus state
      return succeed(
        NextResponse.json({
          quest: null,
          book: null,
          course: null,
        })
      );
    }

    // Fetch the actual objects for the focused items
    const [quest, book, course] = await Promise.all([
      focusSlot.quest_id
        ? prisma.quest.findUnique({ where: { id: focusSlot.quest_id } })
        : null,
      focusSlot.book_id
        ? prisma.book.findUnique({ where: { id: focusSlot.book_id } })
        : null,
      focusSlot.course_id
        ? prisma.course.findUnique({ where: { id: focusSlot.course_id } })
        : null,
    ]);

    // Return proper FocusState object
    const focusState = {
      quest: quest || null,
      book: book || null,
      course: course || null,
    };

    return succeed(NextResponse.json(focusState));
  } catch (error) {
    console.error('Error fetching focus slot:', error);
    return fail('Failed to fetch focus slot');
  }
}

async function updateFocusSlot(
  userId: string,
  req: NextRequest
): Promise<Result<NextResponse, string>> {
  try {
    const body = await req.json();
    const { type, id } = body || {};

    // First, get the current focus state to preserve existing focus
    const currentFocusSlot = await prisma.focusSlot.findUnique({
      where: { user_id: userId },
    });

    // Handle the new payload format: { type, id }
    const updateData: {
      quest_id: string | null;
      book_id: string | null;
      course_id: string | null;
    } = {
      quest_id: currentFocusSlot?.quest_id || null,
      book_id: currentFocusSlot?.book_id || null,
      course_id: currentFocusSlot?.course_id || null,
    };

    // If type and id are provided, update the appropriate field
    if (type) {
      if (id === null) {
        // Remove focus for this type
        switch (type) {
          case 'quest':
            updateData.quest_id = null;
            break;
          case 'book':
            updateData.book_id = null;
            break;
          case 'course':
            updateData.course_id = null;
            break;
          default:
            return fail('Invalid type. Must be quest, book, or course');
        }
      } else if (id) {
        // Set focus for this type
        switch (type) {
          case 'quest':
            updateData.quest_id = id;
            break;
          case 'book':
            updateData.book_id = id;
            break;
          case 'course':
            updateData.course_id = id;
            break;
          default:
            return fail('Invalid type. Must be quest, book, or course');
        }
      }
    }

    // Validate that only one of each type can be focused
    const focusCount = [
      updateData.quest_id,
      updateData.book_id,
      updateData.course_id,
    ].filter(Boolean).length;
    if (focusCount > 3) {
      return fail('Maximum 3 items can be focused');
    }

    const focusSlot = await prisma.focusSlot.upsert({
      where: { user_id: userId },
      update: updateData,
      create: {
        user_id: userId,
        quest_id: updateData.quest_id,
        book_id: updateData.book_id,
        course_id: updateData.course_id,
      },
    });

    // Fetch the actual objects for the updated focus items
    const [quest, book, course] = await Promise.all([
      focusSlot.quest_id
        ? prisma.quest.findUnique({ where: { id: focusSlot.quest_id } })
        : null,
      focusSlot.book_id
        ? prisma.book.findUnique({ where: { id: focusSlot.book_id } })
        : null,
      focusSlot.course_id
        ? prisma.course.findUnique({ where: { id: focusSlot.course_id } })
        : null,
    ]);

    // Return proper FocusState object
    const focusState = {
      quest: quest || null,
      book: book || null,
      course: course || null,
    };

    return succeed(NextResponse.json(focusState));
  } catch (error) {
    console.error('Error updating focus slot:', error);
    return fail('Failed to update focus slot');
  }
}

export const GET = withUserAuth(getFocusSlot);
export const PUT = withUserAuth(updateFocusSlot);

async function clearFocus(
  userId: string,
  req: NextRequest
): Promise<Result<NextResponse, string>> {
  try {
    const body = await req.json();
    const { type } = body || {};

    if (type) {
      // Remove specific type from focus while preserving others
      const updateData: { quest_id?: null; book_id?: null; course_id?: null } =
        {};

      switch (type) {
        case 'quest':
          updateData.quest_id = null;
          break;
        case 'book':
          updateData.book_id = null;
          break;
        case 'course':
          updateData.course_id = null;
          break;
        default:
          return fail('Invalid type. Must be quest, book, or course');
      }

      await prisma.focusSlot.updateMany({
        where: { user_id: userId },
        data: updateData,
      });

      // Return updated focus state (preserving other types)
      const updatedFocusSlot = await prisma.focusSlot.findUnique({
        where: { user_id: userId },
      });

      if (updatedFocusSlot) {
        const [quest, book, course] = await Promise.all([
          updatedFocusSlot.quest_id
            ? prisma.quest.findUnique({
                where: { id: updatedFocusSlot.quest_id },
              })
            : null,
          updatedFocusSlot.book_id
            ? prisma.book.findUnique({
                where: { id: updatedFocusSlot.book_id },
              })
            : null,
          updatedFocusSlot.course_id
            ? prisma.course.findUnique({
                where: { id: updatedFocusSlot.course_id },
              })
            : null,
        ]);

        return succeed(NextResponse.json({ quest, book, course }));
      }
    } else {
      // Clear all focus
      await prisma.focusSlot.updateMany({
        where: { user_id: userId },
        data: {
          quest_id: null,
          book_id: null,
          course_id: null,
        },
      });
    }

    return succeed(
      NextResponse.json({
        quest: null,
        book: null,
        course: null,
      })
    );
  } catch (error) {
    console.error('Failed to clear focus:', error);
    return fail('Failed to clear focus');
  }
}

export const DELETE = withUserAuth(clearFocus);
