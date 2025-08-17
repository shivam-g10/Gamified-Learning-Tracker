'use client';

import type { FocusState } from '../lib/types';
import { Result, succeed, fail } from '../lib/result';
import { FocusAPI } from '../lib/api';

export class FocusService {
  /**
   * Gets the current focus state
   */
  static async getFocusState(): Promise<FocusState> {
    const result = await FocusAPI.getFocusState();
    if (result._tag === 'Failure') {
      throw new Error(result.error);
    }
    return result.data;
  }

  /**
   * Sets focus for a quest, book, or course
   * Enforces the 1+1+1 rule (one of each category)
   */
  static async setFocus(
    type: 'quest' | 'book' | 'course',
    id: string
  ): Promise<FocusState> {
    const result = await FocusAPI.setFocus(type, id);
    if (result._tag === 'Failure') {
      throw new Error(result.error);
    }
    return result.data;
  }

  /**
   * Removes focus from a specific type
   */
  static async removeFocus(
    type: 'quest' | 'book' | 'course'
  ): Promise<FocusState> {
    const result = await FocusAPI.removeFocus(type);
    if (result._tag === 'Failure') {
      throw new Error(result.error);
    }
    return result.data;
  }

  /**
   * Checks if an item can be added to focus
   */
  static async canAddToFocus(
    type: 'quest' | 'book' | 'course'
  ): Promise<boolean> {
    try {
      const focusState = await this.getFocusState();

      // Check if the type is already in focus
      if (type === 'quest' && focusState.quest) {
        return false;
      }
      if (type === 'book' && focusState.book) {
        return false;
      }
      if (type === 'course' && focusState.course) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
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
    try {
      const focusState = await this.getFocusState();

      if (type === 'quest' && focusState.quest?.id === id) {
        return true;
      }
      if (type === 'book' && focusState.book?.id === id) {
        return true;
      }
      if (type === 'course' && focusState.course?.id === id) {
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Gets the ID of the currently focused item of a specific type
   */
  static async getFocusedId(
    type: 'quest' | 'book' | 'course'
  ): Promise<string | null> {
    try {
      const focusState = await this.getFocusState();

      if (type === 'quest' && focusState.quest) {
        return focusState.quest.id;
      }
      if (type === 'book' && focusState.book) {
        return focusState.book.id;
      }
      if (type === 'course' && focusState.course) {
        return focusState.course.id;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Switches focus from one item to another of the same type
   */
  static async switchFocus(
    type: 'quest' | 'book' | 'course',
    newId: string
  ): Promise<FocusState> {
    // First remove the current focus, then set the new one
    await this.removeFocus(type);
    return await this.setFocus(type, newId);
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
    try {
      const focusState = await this.getFocusState();

      const questCount = focusState.quest ? 1 : 0;
      const bookCount = focusState.book ? 1 : 0;
      const courseCount = focusState.course ? 1 : 0;

      return {
        questCount,
        bookCount,
        courseCount,
        totalCount: questCount + bookCount + courseCount,
      };
    } catch (error) {
      return {
        questCount: 0,
        bookCount: 0,
        courseCount: 0,
        totalCount: 0,
      };
    }
  }

  /**
   * Clears all focus
   */
  static async clearAllFocus(): Promise<void> {
    const result = await FocusAPI.clearAllFocus();
    if (result._tag === 'Failure') {
      throw new Error(result.error);
    }
  }
}
