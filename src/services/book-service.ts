import { prisma } from '@/lib/db';
import { XPService } from './xp-service';
import type {
  Book,
  BookProgressEntry,
  CreateBookData,
  UpdateBookData,
  LogBookProgressData,
} from '@/lib/types';

export class BookService {
  /**
   * Creates a new book
   */
  static async createBook(data: CreateBookData): Promise<Book> {
    return await prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
        total_pages: data.total_pages,
        category: data.category,
        description: data.description,
        tags: data.tags || [],
      },
    });
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
      const whereClause: {
        status?: 'backlog' | 'reading' | 'finished';
        OR?: Array<{
          title?: { contains: string; mode: 'insensitive' };
          author?: { contains: string; mode: 'insensitive' };
          category?: { contains: string; mode: 'insensitive' };
          description?: { contains: string; mode: 'insensitive' };
        }>;
        tags?: { hasSome: string[] };
        category?: string;
      } = {};

      if (filters?.status) {
        whereClause.status = filters.status;
      }

      if (filters?.search) {
        whereClause.OR = [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { author: { contains: filters.search, mode: 'insensitive' } },
          { category: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      if (filters?.tags && filters.tags.length > 0) {
        whereClause.tags = { hasSome: filters.tags };
      }

      if (filters?.category) {
        whereClause.category = filters.category;
      }

      const books = await prisma.book.findMany({
        where: whereClause,
        orderBy: { updated_at: 'desc' },
      });

      return books;
    } catch (error) {
      console.error('Failed to fetch books:', error);
      throw new Error('Failed to fetch books');
    }
  }

  /**
   * Gets a book by ID
   */
  static async getBookById(id: string): Promise<Book | null> {
    return await prisma.book.findUnique({
      where: { id },
    });
  }

  /**
   * Updates a book
   */
  static async updateBook(id: string, data: UpdateBookData): Promise<Book> {
    return await prisma.book.update({
      where: { id },
      data,
    });
  }

  /**
   * Deletes a book
   */
  static async deleteBook(id: string): Promise<void> {
    await prisma.book.delete({
      where: { id },
    });
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
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

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

    // Create progress entry
    await prisma.bookProgressEntry.create({
      data: {
        book_id: bookId,
        from_page: data.from_page,
        to_page: data.to_page,
        pages_read: pagesRead,
        notes: data.notes,
      },
    });

    // Update book progress
    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: {
        current_page: data.to_page,
        status: data.to_page >= book.total_pages ? 'finished' : 'reading',
        started_at: book.started_at || new Date(),
        finished_at: data.to_page >= book.total_pages ? new Date() : undefined,
      },
    });

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
    const result = await prisma.bookProgressEntry.aggregate({
      _sum: {
        pages_read: true,
      },
    });

    return result._sum.pages_read || 0;
  }

  /**
   * Gets books by status
   */
  static async getBooksByStatus(
    status: 'backlog' | 'reading' | 'finished'
  ): Promise<Book[]> {
    return await prisma.book.findMany({
      where: { status },
      orderBy: { updated_at: 'desc' },
    });
  }

  /**
   * Gets reading progress for a book
   */
  static async getBookProgress(bookId: string): Promise<BookProgressEntry[]> {
    return await prisma.bookProgressEntry.findMany({
      where: { book_id: bookId },
      orderBy: { created_at: 'asc' },
    });
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
    return await prisma.book.findMany({
      where: {
        status: 'reading',
        current_page: { gt: 0 },
      },
      orderBy: { updated_at: 'desc' },
    });
  }
}
