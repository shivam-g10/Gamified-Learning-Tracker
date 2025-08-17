'use client';

import {
  Book,
  CreateBookData,
  UpdateBookData,
  LogBookProgressData,
} from '../lib/types';
import { BookService } from './book-service';
import { Result, succeed, fail } from '../lib/result';

export interface BookManagementResult {
  message: string;
  book?: Book;
}

export interface BookProgressResult {
  message: string;
  xpEarned?: number;
  focusBoostXP?: number;
  finishBonus?: number;
  isFinished?: boolean;
}

/**
 * BookManagementService handles business logic for book operations
 * including validation, error handling, and user feedback messages.
 */
export class BookManagementService {
  /**
   * Creates a new book with proper validation and error handling
   */
  static async createBook(
    data: CreateBookData
  ): Promise<Result<BookManagementResult>> {
    // Validate book data
    if (!data.title?.trim()) {
      return fail('Book title is required');
    }

    if (data.total_pages <= 0) {
      return fail('Total pages must be greater than 0');
    }

    if (!data.category?.trim()) {
      return fail('Category is required');
    }

    try {
      // Create the book
      const book = await BookService.createBook(data);

      return succeed({
        message: 'Book added successfully!',
        book,
      });
    } catch (error) {
      return fail('Failed to create book. Please try again.');
    }
  }

  /**
   * Updates an existing book with proper validation
   */
  static async updateBook(
    bookId: string,
    data: UpdateBookData
  ): Promise<Result<BookManagementResult>> {
    // Validate update data
    if (data.title !== undefined && !data.title?.trim()) {
      return fail('Book title cannot be empty');
    }

    if (data.total_pages !== undefined && data.total_pages <= 0) {
      return fail('Total pages must be greater than 0');
    }

    if (data.current_page !== undefined && data.current_page < 0) {
      return fail('Current page cannot be negative');
    }

    if (
      data.current_page !== undefined &&
      data.total_pages !== undefined &&
      data.current_page > data.total_pages
    ) {
      return fail('Current page cannot exceed total pages');
    }

    try {
      // Update the book
      const book = await BookService.updateBook(bookId, data);

      return succeed({
        message: 'Book updated successfully!',
        book,
      });
    } catch (error) {
      return fail('Failed to update book. Please try again.');
    }
  }

  /**
   * Deletes a book with confirmation
   */
  static async deleteBook(
    bookId: string
  ): Promise<Result<{ message: string }>> {
    try {
      await BookService.deleteBook(bookId);

      return succeed({
        message: 'Book deleted successfully!',
      });
    } catch (error) {
      return fail('Failed to delete book. Please try again.');
    }
  }

  /**
   * Logs book reading progress with XP calculation
   */
  static async logProgress(
    bookId: string,
    data: LogBookProgressData
  ): Promise<Result<BookProgressResult>> {
    // Validate progress data
    if (data.from_page < 0 || data.to_page < 0) {
      return fail('Page numbers cannot be negative');
    }

    if (data.from_page > data.to_page) {
      return fail('From page cannot be greater than to page');
    }

    try {
      // Log the progress
      const result = await BookService.logProgress(bookId, data);

      return succeed({
        message: `Progress logged! +${result.xpEarned} XP earned`,
        xpEarned: result.xpEarned,
        focusBoostXP: 0, // Will be calculated by the calling component if needed
        finishBonus: result.finishBonus,
        isFinished: result.isFinished,
      });
    } catch (error) {
      return fail('Failed to log progress. Please try again.');
    }
  }

  /**
   * Gets book statistics for display
   */
  static getBookStats(books: Book[] | undefined) {
    if (!books) return { total: 0, reading: 0, finished: 0, backlog: 0 };

    const total = books.length;
    const reading = books.filter(b => b.status === 'reading').length;
    const finished = books.filter(b => b.status === 'finished').length;
    const backlog = books.filter(b => b.status === 'backlog').length;

    return { total, reading, finished, backlog };
  }

  /**
   * Validates book data before submission
   */
  static validateBookData(data: CreateBookData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.title?.trim()) {
      errors.push('Book title is required');
    }

    if (data.total_pages <= 0) {
      errors.push('Total pages must be greater than 0');
    }

    if (!data.category?.trim()) {
      errors.push('Category is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Gets book status display information
   */
  static getBookStatusInfo(book: Book) {
    const statusConfig = {
      backlog: { text: 'Backlog', color: 'text-gray-600', icon: '📚' },
      reading: { text: 'Reading', color: 'text-blue-600', icon: '📖' },
      finished: { text: 'Finished', color: 'text-green-600', icon: '✅' },
    };

    const config = statusConfig[book.status] || statusConfig.backlog;

    return {
      statusText: config.text,
      statusColor: config.color,
      statusIcon: config.icon,
      progressPercentage:
        book.total_pages > 0
          ? Math.round((book.current_page / book.total_pages) * 100)
          : 0,
      pagesText: `${book.current_page}/${book.total_pages} pages`,
    };
  }

  /**
   * Calculates reading progress percentage
   */
  static calculateProgressPercentage(book: Book): number {
    if (book.total_pages <= 0) return 0;
    return Math.min(
      100,
      Math.round((book.current_page / book.total_pages) * 100)
    );
  }

  /**
   * Gets book category display information
   */
  static getBookCategoryInfo(books: Book[] | undefined) {
    if (!books) return [];

    const categoryMap = new Map<
      string,
      { total: number; completed: number; percentage: number }
    >();

    books.forEach(book => {
      const current = categoryMap.get(book.category) || {
        total: 0,
        completed: 0,
        percentage: 0,
      };
      current.total += 1;
      if (book.status === 'finished') current.completed += 1;
      categoryMap.set(book.category, current);
    });

    return Array.from(categoryMap.entries()).map(([category, stats]) => ({
      category,
      total: stats.total,
      completed: stats.completed,
      percentage:
        stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
    }));
  }
}
