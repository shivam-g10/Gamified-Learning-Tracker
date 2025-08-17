'use client';

import type { Book, Course } from '../lib/types';

export class ProgressCalculationService {
  /**
   * Calculates progress percentage for a book
   */
  static getBookProgressPercentage(book: Book): number {
    if (book.total_pages <= 0) return 0;
    return Math.min(
      100,
      Math.round((book.current_page / book.total_pages) * 100)
    );
  }

  /**
   * Calculates progress percentage for a course
   */
  static getCourseProgressPercentage(course: Course): number {
    if (course.total_units <= 0) return 0;
    return Math.min(
      100,
      Math.round((course.completed_units / course.total_units) * 100)
    );
  }

  /**
   * Gets progress label for a book
   */
  static getBookProgressLabel(book: Book): string {
    const percentage = this.getBookProgressPercentage(book);
    if (percentage === 0) return 'Not started';
    if (percentage === 100) return 'Completed';
    if (percentage < 25) return 'Just started';
    if (percentage < 50) return 'In progress';
    if (percentage < 75) return 'Halfway there';
    return 'Almost done';
  }

  /**
   * Gets progress label for a course
   */
  static getCourseProgressLabel(course: Course): string {
    const percentage = this.getCourseProgressPercentage(course);
    if (percentage === 0) return 'Not started';
    if (percentage === 100) return 'Completed';
    if (percentage < 25) return 'Just started';
    if (percentage < 50) return 'In progress';
    if (percentage < 75) return 'Halfway there';
    return 'Almost done';
  }

  /**
   * Gets progress label for any learning item
   */
  static getProgressLabel(item: Book | Course): string {
    if ('current_page' in item) {
      return this.getBookProgressLabel(item);
    } else {
      return this.getCourseProgressLabel(item);
    }
  }

  /**
   * Gets progress percentage for any learning item
   */
  static getProgressPercentage(item: Book | Course): number {
    if ('current_page' in item) {
      return this.getBookProgressPercentage(item);
    } else {
      return this.getCourseProgressPercentage(item);
    }
  }

  /**
   * Calculates total pages read from book progress entries
   */
  static calculateTotalPagesRead(
    progressEntries: Array<{ pages_read: number }>
  ): number {
    return progressEntries.reduce(
      (total, entry) => total + entry.pages_read,
      0
    );
  }

  /**
   * Calculates total units completed from course progress entries
   */
  static calculateTotalUnitsCompleted(
    progressEntries: Array<{ units_delta: number }>
  ): number {
    return progressEntries.reduce(
      (total, entry) => total + entry.units_delta,
      0
    );
  }

  /**
   * Calculates XP from pages read
   */
  static calculateBookXP(pagesRead: number): number {
    return Math.ceil(pagesRead / 5);
  }

  /**
   * Calculates XP from units completed
   */
  static calculateCourseXP(unitsCompleted: number): number {
    return 5 * unitsCompleted;
  }
}
