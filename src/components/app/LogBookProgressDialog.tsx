'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Sparkles } from 'lucide-react';
import type { Book } from '@/lib/types';

interface LogBookProgressDialogProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    from_page: number;
    to_page: number;
    notes?: string;
  }) => Promise<void>;
}

export function LogBookProgressDialog({
  book,
  isOpen,
  onClose,
  onSubmit,
}: LogBookProgressDialogProps) {
  const [fromPage, setFromPage] = useState(book.current_page);
  const [toPage, setToPage] = useState(book.current_page);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset form when book changes
  useEffect(() => {
    setFromPage(book.current_page);
    setToPage(book.current_page);
    setNotes('');
    setError('');
  }, [book]);

  const pagesRead = Math.max(0, toPage - fromPage);
  const newProgress = Math.min(
    100,
    Math.round((toPage / book.total_pages) * 100)
  );
  const isFinishing = toPage >= book.total_pages;

  // Calculate XP (basic calculation, will be refined by service)
  const sessionXP = Math.ceil(pagesRead / 5);
  const finishBonus = isFinishing
    ? Math.min(50, Math.ceil(book.total_pages / 10))
    : 0;
  const totalXP = sessionXP + finishBonus;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (fromPage >= toPage) {
      setError('End page must be greater than start page');
      return;
    }

    if (toPage > book.total_pages) {
      setError(`End page cannot exceed total pages (${book.total_pages})`);
      return;
    }

    if (pagesRead === 0) {
      setError('No pages were read');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        from_page: fromPage,
        to_page: toPage,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch {
      setError('Failed to log progress. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <BookOpen className='w-5 h-5 text-green-500' />
            Log Reading Progress
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Book Info */}
          <div className='p-3 bg-muted/30 rounded-lg'>
            <h4 className='font-medium text-sm mb-1'>{book.title}</h4>
            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
              <span>
                Current: {book.current_page}/{book.total_pages} pages
              </span>
              <span>•</span>
              <span className='capitalize'>{book.status}</span>
            </div>
            <div className='mt-2'>
              <Progress value={newProgress} className='h-2' />
              <div className='text-xs text-muted-foreground mt-1'>
                {newProgress}% complete
              </div>
            </div>
          </div>

          {/* Progress Inputs */}
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <Label htmlFor='from-page'>From Page</Label>
              <Input
                id='from-page'
                type='number'
                min={0}
                max={book.total_pages}
                value={fromPage}
                onChange={e => setFromPage(parseInt(e.target.value) || 0)}
                className='mt-1'
              />
            </div>
            <div>
              <Label htmlFor='to-page'>To Page</Label>
              <Input
                id='to-page'
                type='number'
                min={fromPage + 1}
                max={book.total_pages}
                value={toPage}
                onChange={e => setToPage(parseInt(e.target.value) || 0)}
                className='mt-1'
              />
            </div>
          </div>

          {/* Pages Read Summary */}
          {pagesRead > 0 && (
            <div className='p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-green-700 dark:text-green-300'>
                  Pages Read: {pagesRead}
                </span>
                <Badge
                  variant='outline'
                  className='border-green-300 text-green-700 dark:border-green-600 dark:text-green-300'
                >
                  +{sessionXP} XP
                </Badge>
              </div>
              {isFinishing && (
                <div className='flex items-center gap-2 mt-2 text-sm text-green-600 dark:text-green-400'>
                  <Sparkles className='w-4 h-4' />
                  <span>Finish Bonus: +{finishBonus} XP</span>
                </div>
              )}
              <div className='mt-2 text-sm text-green-600 dark:text-green-400'>
                Total XP: <span className='font-bold'>+{totalXP}</span>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor='notes'>Notes (Optional)</Label>
            <Textarea
              id='notes'
              placeholder='What did you learn? Any insights or thoughts?'
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className='mt-1'
              rows={3}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className='p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive'>
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className='flex justify-end gap-3 pt-2'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isSubmitting || pagesRead === 0}
              className='min-w-[100px]'
            >
              {isSubmitting ? 'Logging...' : 'Log Progress'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
