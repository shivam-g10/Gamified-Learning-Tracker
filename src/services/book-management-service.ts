import {
  Book,
  CreateBookData,
  UpdateBookData,
  LogBookProgressData,
} from '../lib/types';
import { BookService } from './book-service';

export interface BookManagementResult {
  success: boolean;
  message: string;
  book?: Book;
  error?: string;
}

export interface BookProgressResult {
  success: boolean;
  message: string;
  xpEarned?: number;
  focusBoostXP?: number;
  finishBonus?: number;
  isFinished?: boolean;
  error?: string;
}

/**
 * BookManagementService handles business logic for book operations
 * including validation, error handling, and user feedback messages.
 */
export class BookManagementService {
  /**
   * Creates a new book with proper validation and error handling
   */
  static async createBook(data: CreateBookData): Promise<BookManagementResult> {
    try {
      // Validate book data
      if (!data.title?.trim()) {
        return {
          success: false,
          error: 'Book title is required',
          message: 'Please provide a book title',
        };
      }

      if (data.total_pages <= 0) {
        return {
          success: false,
          error: 'Total pages must be greater than 0',
          message: 'Please provide a valid page count',
        };
      }

      if (!data.category?.trim()) {
        return {
          success: false,
          error: 'Category is required',
          message: 'Please provide a book category',
        };
      }

      // Create the book
      const book = await BookService.createBook(data);

      return {
        success: true,
        message: 'Book added successfully!',
        book,
      };
    } catch (error) {
      console.error('Failed to create book:', error);
      return {
        success: false,
        error: 'Failed to create book',
        message: 'Failed to add book. Please try again.',
      };
    }
  }

  /**
   * Updates an existing book with proper validation
   */
  static async updateBook(
    bookId: string,
    data: UpdateBookData
  ): Promise<BookManagementResult> {
    try {
      // Validate update data
      if (data.title !== undefined && !data.title?.trim()) {
        return {
          success: false,
          error: 'Book title cannot be empty',
          message: 'Please provide a valid book title',
        };
      }

      if (data.total_pages !== undefined && data.total_pages <= 0) {
        return {
          success: false,
          error: 'Total pages must be greater than 0',
          message: 'Please provide a valid page count',
        };
      }

      if (data.current_page !== undefined && data.current_page < 0) {
        return {
          success: false,
          error: 'Current page cannot be negative',
          message: 'Please provide a valid current page',
        };
      }

      if (
        data.current_page !== undefined &&
        data.total_pages !== undefined &&
        data.current_page > data.total_pages
      ) {
        return {
          success: false,
          error: 'Current page cannot exceed total pages',
          message: 'Current page cannot be greater than total pages',
        };
      }

      // Update the book
      const book = await BookService.updateBook(bookId, data);

      return {
        success: true,
        message: 'Book updated successfully!',
        book,
      };
    } catch (error) {
      console.error('Failed to update book:', error);
      return {
        success: false,
        error: 'Failed to update book',
        message: 'Failed to update book. Please try again.',
      };
    }
  }

  /**
   * Deletes a book with confirmation
   */
  static async deleteBook(bookId: string): Promise<BookManagementResult> {
    try {
      await BookService.deleteBook(bookId);

      return {
        success: true,
        message: 'Book deleted successfully!',
      };
    } catch (error) {
      console.error('Failed to delete book:', error);
      return {
        success: false,
        error: 'Failed to delete book',
        message: 'Failed to delete book. Please try again.',
      };
    }
  }

  /**
   * Logs book reading progress with XP calculation
   */
  static async logProgress(
    bookId: string,
    data: LogBookProgressData
  ): Promise<BookProgressResult> {
    try {
      // Validate progress data
      if (data.from_page < 0 || data.to_page < 0) {
        return {
          success: false,
          error: 'Page numbers cannot be negative',
          message: 'Please provide valid page numbers',
        };
      }

      if (data.from_page > data.to_page) {
        return {
          success: false,
          error: 'From page cannot be greater than to page',
          message: 'Please provide valid page range',
        };
      }

      // Log the progress
      const result = await BookService.logProgress(bookId, data);

      return {
        success: true,
        message: `Progress logged! +${result.xpEarned} XP earned`,
        xpEarned: result.xpEarned,
        focusBoostXP: 0, // Will be calculated by the calling component if needed
        finishBonus: result.finishBonus,
        isFinished: result.isFinished,
      };
    } catch (error) {
      console.error('Failed to log book progress:', error);
      return {
        success: false,
        error: 'Failed to log progress',
        message: 'Failed to log progress. Please try again.',
      };
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
