'use client';

import { XPService } from './xp-service';
import type {
  Book,
  BookProgressEntry,
  CreateBookData,
  UpdateBookData,
  LogBookProgressData,
} from '../lib/types';
import { Result, succeed, fail } from '../lib/result';
import { BookAPI } from '../lib/api';

export class BookService {
  /**
   * Creates a new book
   */
  static async createBook(data: CreateBookData): Promise<Book> {
    const result = await BookAPI.createBook(data);
    if (result._tag === 'Failure') {
      throw new Error(result.error);
    }
    return result.data;
  }

  /**
   * Gets all books with optional filtering
   */
  static async getBooks(filters?: {
    status?: 'backlog' | 'reading' | 'finished';
    search?: string;
    tags?: string[];
    category?: string;
  }): Promise<Book[]> {
    try {
      const result = await BookAPI.getAllBooks();
      if (result._tag === 'Failure') {
        throw new Error(result.error);
      }
      
      let books = result.data;
      
      // Apply filters client-side since the API doesn't support complex filtering yet
      if (filters?.status) {
        books = books.filter(book => book.status === filters.status);
      }
      
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        books = books.filter(book => 
          book.title.toLowerCase().includes(searchLower) ||
          (book.author && book.author.toLowerCase().includes(searchLower)) ||
          book.category.toLowerCase().includes(searchLower) ||
          (book.description && book.description.toLowerCase().includes(searchLower))
        );
      }
      
      if (filters?.tags && filters.tags.length > 0) {
        books = books.filter(book => 
          filters.tags!.some(tag => book.tags.includes(tag))
        );
      }
      
      if (filters?.category) {
        books = books.filter(book => book.category === filters.category);
      }
      
      return books.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    } catch (error) {
      console.error('Failed to fetch books:', error);
      throw new Error('Failed to fetch books');
    }
  }

  /**
   * Gets a book by ID
   */
  static async getBookById(id: string): Promise<Book | null> {
    const result = await BookAPI.getBookById(id);
    if (result._tag === 'Failure') {
      throw new Error(result.error);
    }
    return result.data;
  }

  /**
   * Updates a book
   */
  static async updateBook(id: string, data: UpdateBookData): Promise<Book> {
    const result = await BookAPI.updateBook(id, data);
    if (result._tag === 'Failure') {
      throw new Error(result.error);
    }
    return result.data;
  }

  /**
   * Deletes a book
   */
  static async deleteBook(id: string): Promise<void> {
    const result = await BookAPI.deleteBook(id);
    if (result._tag === 'Failure') {
      throw new Error(result.error);
    }
  }

  /**
   * Logs progress for a book and awards XP
   */
  static async logProgress(
    bookId: string,
    data: LogBookProgressData,
    isInFocus: boolean = false
  ): Promise<{
    book: Book;
    xpEarned: number;
    isFinished: boolean;
    finishBonus: number;
  }> {
    const book = await this.getBookById(bookId);

    if (!book) {
      throw new Error('Book not found');
    }

    // Validate progress
    if (data.to_page <= data.from_page) {
      throw new Error('Invalid page range');
    }

    if (data.to_page > book.total_pages) {
      throw new Error('Page number exceeds total pages');
    }

    // Calculate pages read
    const pagesRead = data.to_page - data.from_page;

    // Create progress entry and update book via API
    const result = await BookAPI.logProgress(bookId, data);
    if (result._tag === 'Failure') {
      throw new Error(result.error);
    }
    
    const updatedBook = result.data;

    // Calculate XP with focus boost
    const sessionXP = XPService.calculateBookSessionXP(pagesRead, isInFocus);
    const finishBonus =
      data.to_page >= book.total_pages
        ? XPService.calculateBookFinishBonus(book.total_pages)
        : 0;
    const totalXP = sessionXP + finishBonus;
    const isFinished = data.to_page >= book.total_pages;

    return {
      book: updatedBook,
      xpEarned: totalXP,
      isFinished,
      finishBonus,
    };
  }

  /**
   * Calculates XP for a reading session (deprecated - use XPService)
   */
  static calculateSessionXP(pagesRead: number): number {
    return XPService.calculateBookSessionXP(pagesRead, false);
  }

  /**
   * Calculates finish bonus XP (deprecated - use XPService)
   */
  static calculateFinishBonus(totalPages: number): number {
    return XPService.calculateBookFinishBonus(totalPages);
  }

  /**
   * Gets total pages read across all books
   */
  static async getTotalPagesRead(): Promise<number> {
    // This would need to be implemented in the API or calculated client-side
    // For now, we'll get all books and calculate the total
    const books = await this.getBooks();
    return books.reduce((total, book) => total + book.current_page, 0);
  }

  /**
   * Gets books by status
   */
  static async getBooksByStatus(
    status: 'backlog' | 'reading' | 'finished'
  ): Promise<Book[]> {
    const result = await BookAPI.getBooksByStatus(status);
    if (result._tag === 'Failure') {
      throw new Error(result.error);
    }
    return result.data.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }

  /**
   * Gets reading progress for a book
   */
  static async getBookProgress(bookId: string): Promise<BookProgressEntry[]> {
    const result = await BookAPI.getBookProgressHistory(bookId);
    if (result._tag === 'Failure') {
      throw new Error(result.error);
    }
    return result.data;
  }

  /**
   * Calculates reading progress percentage
   */
  static calculateProgressPercentage(
    currentPage: number,
    totalPages: number
  ): number {
    if (totalPages === 0) return 0;
    return Math.min(100, Math.round((currentPage / totalPages) * 100));
  }

  /**
   * Gets books that need attention (started but not finished)
   */
  static async getActiveBooks(): Promise<Book[]> {
    const books = await this.getBooks();
    return books.filter(book => 
      book.status === 'reading' && book.current_page > 0
    ).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }
}
