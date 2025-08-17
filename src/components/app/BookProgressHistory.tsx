'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Calendar, FileText, TrendingUp } from 'lucide-react';
import type { Book, BookProgressEntry } from '@/lib/types';

interface BookProgressHistoryProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}

export function BookProgressHistory({
  book,
  isOpen,
  onClose,
}: BookProgressHistoryProps) {
  const [progressEntries, setProgressEntries] = useState<BookProgressEntry[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const loadProgressHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/books/${book.id}/progress`);
      if (response.ok) {
        const data = await response.json();
        setProgressEntries(data.progressEntries || []);
      }
    } catch (error) {
      console.error('Failed to load progress history:', error);
    } finally {
      setIsLoading(false);
    }
  }, [book.id]);

  useEffect(() => {
    if (isOpen && book) {
      loadProgressHistory();
    }
  }, [isOpen, book, loadProgressHistory]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateTotalPagesRead = () => {
    return progressEntries.reduce(
      (total, entry) => total + entry.pages_read,
      0
    );
  };

  const calculateTotalXP = () => {
    return Math.ceil(calculateTotalPagesRead() / 5);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-2xl max-h-[80vh]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <BookOpen className='w-5 h-4 text-green-500' />
            Reading Progress History
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Book Summary */}
          <div className='p-4 bg-muted/30 rounded-lg'>
            <h3 className='font-medium text-sm mb-2'>{book.title}</h3>
            <div className='flex items-center gap-4 text-sm text-muted-foreground mb-2'>
              <div className='flex items-center gap-1'>
                <TrendingUp className='w-4 h-4' />
                <span>Total Pages Read: {calculateTotalPagesRead()}</span>
              </div>
              <div className='flex items-center gap-1'>
                <BookOpen className='w-4 h-4' />
                <span>
                  Current: {book.current_page}/{book.total_pages}
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <FileText className='w-4 h-4' />
                <span>XP Earned: {calculateTotalXP()}</span>
              </div>
            </div>
            {/* Category display */}
            <div className='flex items-center gap-2'>
              <Badge
                variant='outline'
                className='text-xs border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20'
              >
                {book.category}
              </Badge>
              {book.author && (
                <span className='text-xs text-muted-foreground'>
                  by {book.author}
                </span>
              )}
            </div>
          </div>

          {/* Progress Entries */}
          <div>
            <h4 className='font-medium text-sm mb-3'>Progress Logs</h4>
            {isLoading ? (
              <div className='text-center py-8 text-muted-foreground'>
                Loading progress history...
              </div>
            ) : progressEntries.length === 0 ? (
              <div className='text-center py-8 text-muted-foreground'>
                <BookOpen className='w-8 h-8 mx-auto mb-2 opacity-50' />
                <p>No progress logs yet</p>
                <p className='text-xs'>Start reading to log your progress!</p>
              </div>
            ) : (
              <ScrollArea className='h-64'>
                <div className='space-y-3 pr-4'>
                  {progressEntries.map(entry => (
                    <div
                      key={entry.id}
                      className='p-3 border border-border rounded-lg bg-card'
                    >
                      <div className='flex items-start justify-between mb-2'>
                        <div className='flex items-center gap-2'>
                          <Badge variant='outline' className='text-xs'>
                            {entry.pages_read} pages
                          </Badge>
                          <span className='text-xs text-muted-foreground'>
                            {entry.from_page} → {entry.to_page}
                          </span>
                        </div>
                        <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                          <Calendar className='w-3 h-3' />
                          {formatDate(entry.created_at)}
                        </div>
                      </div>

                      {entry.notes && (
                        <div className='mt-2 p-2 bg-muted/30 rounded text-sm'>
                          <div className='flex items-start gap-2'>
                            <FileText className='w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0' />
                            <div className='flex-1'>
                              <p className='text-muted-foreground text-xs mb-1'>
                                Notes:
                              </p>
                              <p className='text-foreground'>{entry.notes}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        <div className='flex justify-end pt-4'>
          <Button onClick={onClose} variant='outline'>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
