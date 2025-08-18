import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withUserAuth } from '@/lib/auth-utils';
import { Result, succeed, fail } from '@/lib/result';

export const dynamic = 'force-dynamic';

async function getBook(
  userId: string,
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Result<NextResponse, string>> {
  try {
    const { id } = await params;
    const book = await prisma.book.findUnique({
      where: { id, user_id: userId },
    });

    if (!book) {
      return fail('Book not found');
    }

    return succeed(NextResponse.json(book));
  } catch (error) {
    console.error('Error fetching book:', error);
    return fail('Failed to fetch book');
  }
}

async function updateBook(
  userId: string,
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Result<NextResponse, string>> {
  try {
    const { id } = await params;
    const body = await req.json();

    // Verify the book belongs to the user
    const existingBook = await prisma.book.findUnique({
      where: { id, user_id: userId },
    });

    if (!existingBook) {
      return fail('Book not found');
    }

    const book = await prisma.book.update({
      where: { id, user_id: userId },
      data: body,
    });

    return succeed(NextResponse.json(book));
  } catch (error) {
    console.error('Error updating book:', error);
    return fail('Failed to update book');
  }
}

async function deleteBook(
  userId: string,
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Result<NextResponse, string>> {
  try {
    const { id } = await params;

    // Verify the book belongs to the user
    const existingBook = await prisma.book.findUnique({
      where: { id, user_id: userId },
    });

    if (!existingBook) {
      return fail('Book not found');
    }

    await prisma.book.delete({
      where: { id, user_id: userId },
    });

    return succeed(NextResponse.json({ success: true }));
  } catch (error) {
    console.error('Error deleting book:', error);
    return fail('Failed to delete book');
  }
}

export const GET = withUserAuth(getBook);
export const PATCH = withUserAuth(updateBook);
export const PUT = withUserAuth(updateBook);
export const DELETE = withUserAuth(deleteBook);
