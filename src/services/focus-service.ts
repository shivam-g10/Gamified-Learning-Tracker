import { prisma } from '@/lib/db';
import type { FocusSlot, FocusState, Quest, Book, Course } from '@/lib/types';

export class FocusService {
  /**
   * Gets the current focus state
   */
  static async getFocusState(): Promise<FocusState> {
    const focusSlot = await prisma.focusSlot.findFirst();

    if (!focusSlot) {
      return {};
    }

    // Fetch the focused items with their data
    const [questData, bookData, courseData] = await Promise.all([
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

    // Transform Prisma data to match our types
    const quest = questData
      ? {
          ...questData,
          created_at: questData.created_at.toISOString(),
        }
      : undefined;

    const book = bookData || undefined;
    const course = courseData || undefined;

    return {
      quest,
      book,
      course,
    };
  }

  /**
   * Sets focus for a quest, book, or course
   * Enforces the 1+1+1 rule (one of each category)
   */
  static async setFocus(
    type: 'quest' | 'book' | 'course',
    id: string
  ): Promise<FocusState> {
    // Get current focus state
    let focusSlot = await prisma.focusSlot.findFirst();

    if (!focusSlot) {
      // Create new focus slot
      focusSlot = await prisma.focusSlot.create({
        data: {
          quest_id: type === 'quest' ? id : null,
          book_id: type === 'book' ? id : null,
          course_id: type === 'course' ? id : null,
        },
      });
    } else {
      // Update existing focus slot - only update the specific type
      // This allows one of each category to be focused
      const updateData: any = {};
      updateData[`${type}_id`] = id;

      await prisma.focusSlot.update({
        where: { id: focusSlot.id },
        data: updateData,
      });
    }

    // Return updated focus state
    return await this.getFocusState();
  }

  /**
   * Removes focus from a specific type
   */
  static async removeFocus(
    type: 'quest' | 'book' | 'course'
  ): Promise<FocusState> {
    const focusSlot = await prisma.focusSlot.findFirst();

    if (!focusSlot) {
      return {};
    }

    const updateData: any = {};
    updateData[`${type}_id`] = null;

    await prisma.focusSlot.update({
      where: { id: focusSlot.id },
      data: updateData,
    });

    return await this.getFocusState();
  }

  /**
   * Checks if an item can be added to focus
   */
  static async canAddToFocus(
    type: 'quest' | 'book' | 'course'
  ): Promise<boolean> {
    const focusSlot = await prisma.focusSlot.findFirst();

    if (!focusSlot) {
      return true; // No focus slot exists, can add
    }

    // Check if the type is already in focus
    const currentId = focusSlot[`${type}_id`];
    if (currentId) {
      return false; // Already in focus
    }

    return true;
  }

  /**
   * Gets focus validation error message
   */
  static getFocusValidationMessage(type: 'quest' | 'book' | 'course'): string {
    return `A ${type} is already in focus. Remove it first to add another.`;
  }

  /**
   * Gets focus limit error message
   */
  static getFocusLimitMessage(): string {
    return 'Focus limit reached. You can only have 1 quest, 1 book, and 1 course in focus at a time.';
  }

  /**
   * Checks if an item is currently in focus
   */
  static async isInFocus(
    type: 'quest' | 'book' | 'course',
    id: string
  ): Promise<boolean> {
    const focusSlot = await prisma.focusSlot.findFirst();

    if (!focusSlot) {
      return false;
    }

    return focusSlot[`${type}_id`] === id;
  }

  /**
   * Gets the ID of the currently focused item of a specific type
   */
  static async getFocusedId(
    type: 'quest' | 'book' | 'course'
  ): Promise<string | null> {
    const focusSlot = await prisma.focusSlot.findFirst();

    if (!focusSlot) {
      return null;
    }

    return focusSlot[`${type}_id`];
  }

  /**
   * Switches focus from one item to another of the same type
   */
  static async switchFocus(
    type: 'quest' | 'book' | 'course',
    newId: string
  ): Promise<FocusState> {
    const focusSlot = await prisma.focusSlot.findFirst();

    if (!focusSlot) {
      // Create new focus slot
      return await this.setFocus(type, newId);
    }

    // Update the specific type
    const updateData: any = {};
    updateData[`${type}_id`] = newId;

    await prisma.focusSlot.update({
      where: { id: focusSlot.id },
      data: updateData,
    });

    return await this.getFocusState();
  }

  /**
   * Gets focus statistics
   */
  static async getFocusStats(): Promise<{
    questCount: number;
    bookCount: number;
    courseCount: number;
    totalCount: number;
  }> {
    const focusSlot = await prisma.focusSlot.findFirst();

    if (!focusSlot) {
      return {
        questCount: 0,
        bookCount: 0,
        courseCount: 0,
        totalCount: 0,
      };
    }

    const questCount = focusSlot.quest_id ? 1 : 0;
    const bookCount = focusSlot.book_id ? 1 : 0;
    const courseCount = focusSlot.course_id ? 1 : 0;

    return {
      questCount,
      bookCount,
      courseCount,
      totalCount: questCount + bookCount + courseCount,
    };
  }

  /**
   * Clears all focus
   */
  static async clearAllFocus(): Promise<void> {
    const focusSlot = await prisma.focusSlot.findFirst();

    if (focusSlot) {
      await prisma.focusSlot.update({
        where: { id: focusSlot.id },
        data: {
          quest_id: null,
          book_id: null,
          course_id: null,
        },
      });
    }
  }
}
