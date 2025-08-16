'use client';

import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, GraduationCap, Target, Plus, X } from 'lucide-react';
import type { Quest, Book, Course, FocusState } from '@/lib/types';

interface FocusRowProps {
  focusState: FocusState;
  quests: Quest[];
  books: Book[];
  courses: Course[];
  onUpdateFocus: (
    type: 'quest' | 'book' | 'course',
    id: string | null
  ) => Promise<void>;
  onNavigateToTab: (tab: 'quests' | 'books' | 'courses') => void;
  onToggleQuestDone?: (quest: Quest) => Promise<void>;
  onUpdateBookProgress?: (book: Book) => void;
  onUpdateCourseProgress?: (course: Course) => void;
}

export function FocusRow({
  focusState,
  quests,
  books,
  courses,
  onUpdateFocus,
  onNavigateToTab,
  onToggleQuestDone,
  onUpdateBookProgress,
  onUpdateCourseProgress,
}: FocusRowProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleFocusAction = useCallback(
    async (type: 'quest' | 'book' | 'course', id: string | null) => {
      setIsLoading(type);
      try {
        await onUpdateFocus(type, id);
      } finally {
        setIsLoading(null);
      }
    },
    [onUpdateFocus]
  );

  const getProgressPercentage = (item: Quest | Book | Course) => {
    if ('done' in item) {
      // Quest
      return item.done ? 100 : 0;
    } else if ('current_page' in item) {
      // Book
      return item.total_pages > 0
        ? Math.round((item.current_page / item.total_pages) * 100)
        : 0;
    } else {
      // Course
      return item.total_units > 0
        ? Math.round((item.completed_units / item.total_units) * 100)
        : 0;
    }
  };

  const getProgressLabel = (item: Quest | Book | Course) => {
    if ('done' in item) {
      // Quest
      return item.done ? 'Completed' : 'Not Started';
    } else if ('current_page' in item) {
      // Book
      return `${item.current_page}/${item.total_pages} pages`;
    } else {
      // Course
      return `${item.completed_units}/${item.total_units} units`;
    }
  };

  const getStatusBadge = (item: Quest | Book | Course) => {
    if ('done' in item) {
      // Quest
      return item.done ? (
        <Badge variant='default' className='bg-green-600'>
          Completed
        </Badge>
      ) : (
        <Badge variant='outline'>Active</Badge>
      );
    } else if ('status' in item) {
      // Book or Course
      const status = item.status;
      if (status === 'finished') {
        return (
          <Badge variant='default' className='bg-green-600'>
            Finished
          </Badge>
        );
      } else if (status === 'reading' || status === 'learning') {
        return <Badge variant='outline'>Active</Badge>;
      } else {
        return <Badge variant='secondary'>Backlog</Badge>;
      }
    }
    return null;
  };

  const renderFocusSlot = (
    type: 'quest' | 'book' | 'course',
    item: Quest | Book | Course | undefined,
    icon: React.ReactNode,
    title: string
  ) => {
    if (item) {
      const progress = getProgressPercentage(item);
      const progressLabel = getProgressLabel(item);
      const statusBadge = getStatusBadge(item);

      return (
        <Card className='p-4 border-primary/20 bg-primary/5'>
          <div className='flex items-start justify-between mb-3'>
            <div className='flex items-center gap-2'>
              {icon}
              <span className='text-sm font-medium text-muted-foreground'>
                {title}
              </span>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => handleFocusAction(type, null)}
              disabled={isLoading === type}
              className='h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive'
            >
              <X className='h-3 w-3' />
            </Button>
          </div>

          <div className='mb-3'>
            <h4 className='font-medium text-sm line-clamp-2 mb-2'>
              {item.title}
            </h4>
            {'done' in item ? (
              // Quest metadata - show type, category, XP
              <div className='flex items-center gap-2 mb-2 flex-wrap'>
                <Badge
                  variant='outline'
                  className='text-xs border-primary/20 text-primary'
                >
                  {item.type}
                </Badge>
                <Badge
                  variant='outline'
                  className='text-xs border-accent/20 text-accent'
                >
                  {item.category}
                </Badge>
                <Badge
                  variant='default'
                  className='bg-secondary text-secondary-foreground text-xs font-medium'
                >
                  +{item.xp} XP
                </Badge>
              </div>
            ) : (
              // Book/Course - show status badge
              statusBadge
            )}
          </div>

          <div className='mb-3'>
            {'done' in item ? null : ( // Quest - no status display needed
              // Book/Course progress - show percentage
              <>
                <div className='flex justify-between text-xs text-muted-foreground mb-1'>
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className='h-2' />
                <div className='text-xs text-muted-foreground mt-1'>
                  {progressLabel}
                </div>
                {/* Category display for books and courses */}
                <div className='mt-2'>
                  <Badge
                    variant='outline'
                    className={`text-xs ${
                      'current_page' in item
                        ? 'border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20'
                        : 'border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20'
                    }`}
                  >
                    {item.category}
                  </Badge>
                </div>
              </>
            )}
          </div>

          <Button
            size='sm'
            className='w-full'
            onClick={() => {
              if ('done' in item && onToggleQuestDone) {
                onToggleQuestDone(item);
              } else if ('current_page' in item && onUpdateBookProgress) {
                // Book progress update
                onUpdateBookProgress(item);
              } else if ('completed_units' in item && onUpdateCourseProgress) {
                // Course progress update
                onUpdateCourseProgress(item);
              }
            }}
          >
            {'done' in item
              ? item.done
                ? 'Mark as Active'
                : 'Mark Complete'
              : 'Update Progress'}
          </Button>
        </Card>
      );
    }

    return (
      <Card className='p-4 border-dashed border-muted-foreground/30 bg-muted/5'>
        <div className='flex flex-col items-center justify-center h-32 text-center'>
          {icon}
          <p className='text-sm text-muted-foreground mt-2'>Set a Focus</p>
          <p className='text-xs text-muted-foreground/70 mt-1'>
            Choose a {type} to focus on
          </p>
          <Button
            variant='outline'
            size='sm'
            className='mt-3'
            onClick={() =>
              onNavigateToTab(
                type === 'quest'
                  ? 'quests'
                  : type === 'book'
                    ? 'books'
                    : 'courses'
              )
            }
          >
            <Plus className='h-4 w-4 mr-1' />
            Select {title}
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className='mb-6'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-lg font-semibold'>Focus Areas</h2>
        <div className='text-sm text-muted-foreground'>
          {Object.values(focusState).filter(Boolean).length}/3 slots filled
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {renderFocusSlot(
          'quest',
          focusState.quest,
          <Target className='h-4 w-4 text-blue-500' />,
          'Quest'
        )}

        {renderFocusSlot(
          'book',
          focusState.book,
          <BookOpen className='h-4 w-4 text-green-500' />,
          'Book'
        )}

        {renderFocusSlot(
          'course',
          focusState.course,
          <GraduationCap className='h-4 w-4 text-purple-500' />,
          'Course'
        )}
      </div>
    </div>
  );
}
