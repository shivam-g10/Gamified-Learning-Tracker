'use client';

import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, GraduationCap, Target, Plus, X, Eye } from 'lucide-react';
import type { Quest, Book, Course, FocusState } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface FocusRowProps {
  focusState: FocusState;
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

  // Function to get a truncated description preview
  const getDescriptionPreview = (
    description: string,
    maxLength: number = 80
  ) => {
    if (!description || description.trim().length === 0) return null;
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  // Function to render description preview and popup
  const renderDescriptionSection = (item: Quest | Book | Course) => {
    const description = 'description' in item ? item.description : null;
    const descriptionPreview = description
      ? getDescriptionPreview(description, 60)
      : null;

    if (!descriptionPreview) return null;

    return (
      <div className='mb-2'>
        <div className='flex items-start justify-between gap-2'>
          <div className='flex items-start gap-1.5 flex-1'>
            <div className='text-xs text-muted-foreground leading-relaxed line-clamp-2'>
              {descriptionPreview}
            </div>
          </div>

          {/* View Full Description Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                className='p-1 h-4 w-4 hover:bg-muted/30 transition-all duration-200 flex-shrink-0 text-muted-foreground hover:text-foreground'
              >
                <Eye className='w-3 h-3' />
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[500px] w-full max-w-full'>
              <DialogHeader>
                <DialogTitle className='text-lg'>{item.title}</DialogTitle>
                <DialogDescription className='text-sm text-muted-foreground'>
                  {'done' in item
                    ? 'Quest'
                    : 'current_page' in item
                      ? 'Book'
                      : 'Course'}{' '}
                  Details
                </DialogDescription>
              </DialogHeader>
              <div className='space-y-4 w-full min-w-0'>
                {/* Item Metadata */}
                <div className='flex items-center gap-2 flex-wrap w-full min-w-0'>
                  {'done' in item ? (
                    // Quest metadata
                    <>
                      <Badge
                        variant='outline'
                        className='text-xs border-primary/30 text-primary'
                      >
                        {item.type}
                      </Badge>
                      <Badge
                        variant='outline'
                        className='text-xs border-accent/30 text-accent'
                      >
                        {item.category}
                      </Badge>
                      <Badge
                        variant='default'
                        className='bg-secondary text-secondary-foreground text-xs'
                      >
                        +{item.xp} XP
                      </Badge>
                      {item.done && (
                        <Badge
                          variant='default'
                          className='bg-green-600 text-xs'
                        >
                          Completed
                        </Badge>
                      )}
                    </>
                  ) : (
                    // Book/Course metadata
                    <>
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
                      {('current_page' in item
                        ? item.author
                        : item.platform) && (
                        <Badge variant='outline' className='text-xs'>
                          {'current_page' in item ? item.author : item.platform}
                        </Badge>
                      )}
                      {getStatusBadge(item)}
                    </>
                  )}
                </div>

                {/* Full Description */}
                <div className='space-y-2 w-full min-w-0'>
                  <h4 className='font-medium text-sm text-foreground'>
                    Description
                  </h4>
                  <div className='p-3 bg-muted/20 rounded-lg border border-muted-foreground/20 w-full min-w-0 overflow-hidden'>
                    <p className='text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap break-words w-full min-w-0'>
                      {description}
                    </p>
                  </div>
                </div>

                {/* Progress Information */}
                {!('done' in item) && (
                  <div className='space-y-2'>
                    <h4 className='font-medium text-sm text-foreground'>
                      Progress
                    </h4>
                    <div className='p-3 bg-muted/20 rounded-lg border border-muted-foreground/20'>
                      <div className='flex justify-between text-sm text-muted-foreground mb-2'>
                        <span>Current Progress</span>
                        <span>{getProgressPercentage(item)}%</span>
                      </div>
                      <Progress
                        value={getProgressPercentage(item)}
                        className='h-2 mb-2'
                      />
                      <div className='text-sm text-muted-foreground'>
                        {getProgressLabel(item)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Focus Status */}
                <div className='flex items-center gap-2 text-sm text-primary/70 bg-primary/5 p-2 rounded border border-primary/20'>
                  <Target className='w-4 h-4' />
                  <span>Currently focused for learning</span>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
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
        <Card className='p-3 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-all duration-200'>
          {/* Header with icon, title, and close button */}
          <div className='flex items-start justify-between mb-2'>
            <div className='flex items-center gap-2'>
              {icon}
              <span className='text-xs font-medium text-primary/70 uppercase tracking-wide'>
                {title}
              </span>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => handleFocusAction(type, null)}
              disabled={isLoading === type}
              className='h-5 w-5 p-0 hover:bg-destructive/10 hover:text-destructive opacity-60 hover:opacity-100 transition-opacity'
            >
              <X className='h-3 w-3' />
            </Button>
          </div>

          {/* Main content - compact layout */}
          <div className='space-y-2'>
            {/* Title */}
            <h4 className='font-medium text-sm line-clamp-2 leading-tight'>
              {item.title}
            </h4>

            {/* Description Summary */}
            {renderDescriptionSection(item)}

            {/* Metadata Row - compact badges */}
            <div className='flex items-center gap-1.5 flex-wrap'>
              {'done' in item ? (
                // Quest metadata - compact badges
                <>
                  <Badge
                    variant='outline'
                    className='text-xs border-primary/20 text-primary px-1.5 py-0.5 h-5'
                  >
                    {item.type}
                  </Badge>
                  <Badge
                    variant='outline'
                    className='text-xs border-accent/20 text-accent px-1.5 py-0.5 h-5'
                  >
                    {item.category}
                  </Badge>
                  <Badge
                    variant='default'
                    className='bg-secondary text-secondary-foreground text-xs px-1.5 py-0.5 h-5'
                  >
                    +{item.xp} XP
                  </Badge>
                </>
              ) : (
                // Book/Course - compact status and category
                <>
                  {statusBadge && (
                    <div className='scale-75 origin-left'>{statusBadge}</div>
                  )}
                  <Badge
                    variant='outline'
                    className={`text-xs px-1.5 py-0.5 h-5 ${
                      'current_page' in item
                        ? 'border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20'
                        : 'border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20'
                    }`}
                  >
                    {item.category}
                  </Badge>
                </>
              )}
            </div>

            {/* Progress Section - only for books/courses */}
            {!('done' in item) && (
              <div className='space-y-1'>
                <div className='flex justify-between text-xs text-muted-foreground'>
                  <span>Progress</span>
                  <span className='font-medium'>{progress}%</span>
                </div>
                <Progress value={progress} className='h-1.5' />
                <div className='text-xs text-muted-foreground/70'>
                  {progressLabel}
                </div>
              </div>
            )}

            {/* Action Button */}
            <Button
              size='sm'
              className='w-full h-8 text-xs'
              onClick={() => {
                if ('done' in item && onToggleQuestDone) {
                  onToggleQuestDone(item);
                } else if ('current_page' in item && onUpdateBookProgress) {
                  onUpdateBookProgress(item);
                } else if (
                  'completed_units' in item &&
                  onUpdateCourseProgress
                ) {
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
          </div>
        </Card>
      );
    }

    return (
      <Card className='p-3 border-dashed border-muted-foreground/30 bg-muted/5 hover:bg-muted/10 transition-colors'>
        <div className='flex flex-col items-center justify-center h-24 text-center'>
          {icon}
          <p className='text-xs text-muted-foreground mt-1.5'>Set a Focus</p>
          <p className='text-xs text-muted-foreground/70 mt-0.5'>
            Choose a {type}
          </p>
          <Button
            variant='outline'
            size='sm'
            className='mt-2 h-6 text-xs px-2'
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
            <Plus className='w-3 h-3 mr-1' />
            Select
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
