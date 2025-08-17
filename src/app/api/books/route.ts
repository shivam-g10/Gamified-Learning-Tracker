import { NextRequest, NextResponse } from 'next/server';
import { BookService } from '@/services/book-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as
      | 'backlog'
      | 'reading'
      | 'finished'
      | undefined;
    const search = searchParams.get('search') || undefined;
    const tags = searchParams.get('tags')?.split(',') || undefined;

    const filters = {
      status,
      search,
      tags,
    };

    const books = await BookService.getBooks(filters);
    return NextResponse.json(books);
  } catch (error) {
    console.error('Failed to fetch books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, author, total_pages, category, description, tags } = body;

    // Validation
    if (
      !title ||
      typeof total_pages !== 'number' ||
      total_pages < 0 ||
      !category
    ) {
      return NextResponse.json(
        {
          error:
            'Invalid payload. Title, total_pages, and category are required.',
        },
        { status: 400 }
      );
    }

    const book = await BookService.createBook({
      title,
      author,
      total_pages,
      category,
      description,
      tags,
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error('Failed to create book:', error);
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    );
  }
}
