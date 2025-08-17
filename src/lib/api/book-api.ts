'use client';

import type { Book, BookProgressEntry } from '../types';
import type {
  CreateBookData,
  UpdateBookData,
  LogBookProgressData,
} from '../api-types';
import { Result, succeed, fail } from '../result';

export class BookAPI {
  static async getAllBooks(): Promise<Result<Book[]>> {
    try {
      const response = await fetch('/api/books');
      if (!response.ok) {
        return fail('Failed to fetch books');
      }
      const data = await response.json();
      return succeed(data);
    } catch (error) {
      return fail('Failed to fetch books');
    }
  }

  static async getBookById(id: string): Promise<Result<Book>> {
    try {
      const response = await fetch(`/api/books/${id}`);
      if (!response.ok) {
        return fail('Failed to fetch book');
      }
      const book = await response.json();
      return succeed(book);
    } catch (error) {
      return fail('Failed to fetch book');
    }
  }

  static async createBook(data: CreateBookData): Promise<Result<Book>> {
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        return fail('Failed to create book');
      }
      const book = await response.json();
      return succeed(book);
    } catch (error) {
      return fail('Failed to create book');
    }
  }

  static async updateBook(
    id: string,
    data: UpdateBookData
  ): Promise<Result<Book>> {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        return fail('Failed to update book');
      }
      const book = await response.json();
      return succeed(book);
    } catch (error) {
      return fail('Failed to update book');
    }
  }

  static async deleteBook(id: string): Promise<Result<void>> {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        return fail('Failed to delete book');
      }
      return succeed(undefined);
    } catch (error) {
      return fail('Failed to delete book');
    }
  }

  static async logProgress(
    id: string,
    data: LogBookProgressData
  ): Promise<Result<Book>> {
    try {
      const response = await fetch(`/api/books/${id}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        return fail('Failed to log progress');
      }
      const book = await response.json();
      return succeed(book);
    } catch (error) {
      return fail('Failed to log progress');
    }
  }

  static async getBooksByCategory(category: string): Promise<Result<Book[]>> {
    try {
      const response = await fetch(
        `/api/books?category=${encodeURIComponent(category)}`
      );
      if (!response.ok) {
        return fail('Failed to fetch books by category');
      }
      const data = await response.json();
      return succeed(data);
    } catch (error) {
      return fail('Failed to fetch books by category');
    }
  }

  static async getBooksByStatus(status: string): Promise<Result<Book[]>> {
    try {
      const response = await fetch(
        `/api/books?status=${encodeURIComponent(status)}`
      );
      if (!response.ok) {
        return fail('Failed to fetch books by status');
      }
      const data = await response.json();
      return succeed(data);
    } catch (error) {
      return fail('Failed to fetch books by status');
    }
  }

  static async getBookProgressHistory(
    id: string
  ): Promise<Result<BookProgressEntry[]>> {
    try {
      const response = await fetch(`/api/books/${id}/progress`);
      if (!response.ok) {
        return fail('Failed to fetch book progress history');
      }
      const data = await response.json();
      return succeed(data);
    } catch (error) {
      return fail('Failed to fetch book progress history');
    }
  }
}
