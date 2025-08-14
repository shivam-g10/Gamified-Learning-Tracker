'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Plus, Edit, Trash2 } from 'lucide-react';
import { SearchAndFilters, type FilterOption } from './SearchAndFilters';
import type { Book } from '@/lib/types';

interface BooksListProps {
  books: Book[];
  search: string;
  statusFilter: string;
  onAddBook: () => void;
  onEditBook: (book: Book) => void;
  onDeleteBook: (bookId: string) => void;
  onLogProgress: (book: Book) => void;
  onToggleFocus: (book: Book) => void;
  getIsInFocus: (bookId: string) => boolean;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
}

export function BooksList({
  books,
  search,
  statusFilter,
  onAddBook,
  onEditBook,
  onDeleteBook,
  onLogProgress,
  onToggleFocus,
  getIsInFocus,
  onSearchChange,
  onStatusFilterChange,
}: BooksListProps) {
  const filteredBooks = books;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'finished':
        return (
          <Badge variant='default' className='bg-green-600'>
            Finished
          </Badge>
        );
      case 'reading':
        return (
          <Badge variant='outline' className='border-blue-500 text-blue-500'>
            Reading
          </Badge>
        );
      case 'backlog':
        return <Badge variant='secondary'>Backlog</Badge>;
      default:
        return <Badge variant='outline'>{status}</Badge>;
    }
  };

  const getProgressPercentage = (book: Book) => {
    if (book.total_pages === 0) return 0;
    return Math.min(
      100,
      Math.round((book.current_page / book.total_pages) * 100)
    );
  };

  const getProgressLabel = (book: Book) => {
    return `${book.current_page}/${book.total_pages} pages`;
  };

  return (
    <div className='space-y-4'>
      {/* Item Count */}
      <div className='flex items-center gap-2 mb-4'>
        <BookOpen className='h-5 w-5 text-green-500' />
        <Badge variant='outline'>{filteredBooks.length} books</Badge>
      </div>

      {/* Search and Filters */}
      <SearchAndFilters
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder='Search books by title, author, or category...'
        filters={[
          {
            label: 'Status',
            value: statusFilter,
            options: [
              { value: 'all', label: 'All Status' },
              { value: 'backlog', label: 'Backlog' },
              { value: 'reading', label: 'Reading' },
              { value: 'finished', label: 'Finished' },
            ],
            onChange: onStatusFilterChange,
          },
        ]}
      />

      {/* Books Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {filteredBooks.map(book => (
          <Card key={book.id} className='p-4 hover:shadow-md transition-shadow'>
            {/* Book Info */}
            <div className='mb-3'>
              <h3 className='font-medium text-sm line-clamp-2 mb-1'>
                {book.title}
              </h3>
              {book.author && (
                <p className='text-xs text-muted-foreground mb-2'>
                  by {book.author}
                </p>
              )}
              <div className='flex items-center gap-2 mb-2'>
                {getStatusBadge(book.status)}
                {book.tags.length > 0 && (
                  <Badge variant='outline' className='text-xs'>
                    {book.tags[0]}
                    {book.tags.length > 1 && ` +${book.tags.length - 1}`}
                  </Badge>
                )}
                {/* Focus indicator */}
                {getIsInFocus(book.id) && (
                  <Badge
                    variant='outline'
                    className='text-xs border-primary/40 text-primary bg-primary/5'
                  >
                    🎯 Focused
                  </Badge>
                )}
              </div>
            </div>

            {/* Progress */}
            <div className='mb-4'>
              <div className='flex justify-between text-xs text-muted-foreground mb-1'>
                <span>Progress</span>
                <span>{getProgressPercentage(book)}%</span>
              </div>
              <Progress
                value={getProgressPercentage(book)}
                className='h-2 mb-1'
              />
              <div className='text-xs text-muted-foreground'>
                {getProgressLabel(book)}
              </div>
            </div>

            {/* Actions */}
            <div className='flex gap-2'>
              <Button
                size='sm'
                className='flex-1'
                onClick={() => onLogProgress(book)}
                disabled={book.status === 'finished'}
              >
                Log Progress
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onToggleFocus(book)}
                className={`
                  transition-all duration-200 focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    getIsInFocus(book.id)
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 shadow-sm'
                      : 'border-primary/20 text-primary hover:bg-primary/20 hover:border-primary/40 active:bg-primary/30 focus:bg-primary/20 hover:shadow-sm'
                  }
                `}
              >
                {getIsInFocus(book.id) ? 'Unfocus' : 'Focus'}
              </Button>
            </div>

            {/* Edit/Delete */}
            <div className='flex gap-1 mt-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onEditBook(book)}
                className='h-7 px-2 text-muted-foreground hover:text-foreground'
              >
                <Edit className='h-3 w-3' />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onDeleteBook(book.id)}
                className='h-7 px-2 text-muted-foreground hover:text-destructive'
              >
                <Trash2 className='h-3 w-3' />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredBooks.length === 0 && (
        <div className='text-center py-12'>
          <BookOpen className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
          <h3 className='text-lg font-medium text-muted-foreground mb-2'>
            {books.length === 0 ? 'No books yet' : 'No books match your search'}
          </h3>
          <p className='text-sm text-muted-foreground mb-4'>
            {books.length === 0
              ? 'Start building your reading list by adding your first book.'
              : 'Try adjusting your search or filters.'}
          </p>
          {books.length === 0 && (
            <Button onClick={onAddBook}>
              <Plus className='h-4 w-4 mr-1' />
              Add Your First Book
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
