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
import { GraduationCap } from 'lucide-react';
import type { Course } from '@/lib/types';

interface LogCourseProgressDialogProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { units_delta: number; notes?: string }) => Promise<void>;
}

export function LogCourseProgressDialog({
  course,
  isOpen,
  onClose,
  onSubmit,
}: LogCourseProgressDialogProps) {
  const [unitsDelta, setUnitsDelta] = useState(1);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset form when course changes
  useEffect(() => {
    setUnitsDelta(1);
    setNotes('');
    setError('');
  }, [course]);

  const remainingUnits = course.total_units - course.completed_units;
  const newProgress = Math.min(
    100,
    Math.round(
      ((course.completed_units + unitsDelta) / course.total_units) * 100
    )
  );
  const isFinishing = course.completed_units + unitsDelta >= course.total_units;

  // Calculate XP (basic calculation, will be refined by service)
  const sessionXP = 5 * unitsDelta;
  const finishBonus = isFinishing ? 10 + Math.ceil(course.total_units / 2) : 0;
  const totalXP = sessionXP + finishBonus;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (unitsDelta <= 0) {
      setError('Units completed must be greater than 0');
      return;
    }

    if (unitsDelta > remainingUnits) {
      setError(`Cannot complete more than ${remainingUnits} remaining units`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        units_delta: unitsDelta,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (error) {
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
            <GraduationCap className='w-5 h-5 text-purple-500' />
            Log Learning Progress
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Course Info */}
          <div className='p-3 bg-muted/30 rounded-lg'>
            <h4 className='font-medium text-sm mb-1'>{course.title}</h4>
            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
              <span>
                Progress: {course.completed_units}/{course.total_units} units
              </span>
              <span>•</span>
              <span className='capitalize'>{course.status}</span>
            </div>
            <div className='mt-2'>
              <Progress value={newProgress} className='h-2' />
              <div className='text-xs text-muted-foreground mt-1'>
                {newProgress}% complete
              </div>
            </div>
          </div>

          {/* Units Input */}
          <div>
            <Label htmlFor='units-delta'>Units Completed</Label>
            <div className='flex items-center gap-2 mt-1'>
              <Input
                id='units-delta'
                type='number'
                min={1}
                max={remainingUnits}
                value={unitsDelta}
                onChange={e => setUnitsDelta(parseInt(e.target.value) || 1)}
                className='flex-1'
              />
              <span className='text-sm text-muted-foreground whitespace-nowrap'>
                of {remainingUnits} remaining
              </span>
            </div>
          </div>

          {/* Progress Summary */}
          {unitsDelta > 0 && (
            <div className='p-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-purple-700 dark:text-purple-300'>
                  Units: +{unitsDelta}
                </span>
                <Badge
                  variant='outline'
                  className='border-purple-300 text-purple-700 dark:border-purple-600 dark:text-purple-300'
                >
                  +{sessionXP} XP
                </Badge>
              </div>
              {isFinishing && (
                <div className='flex items-center gap-2 mt-2 text-sm text-purple-600 dark:text-purple-400'>
                  <span>Finish Bonus: +{finishBonus} XP</span>
                </div>
              )}
              <div className='mt-2 text-sm text-purple-600 dark:text-purple-400'>
                Total XP: <span className='font-bold'>+{totalXP}</span>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor='notes'>Notes (Optional)</Label>
            <Textarea
              id='notes'
              placeholder='What did you learn? Any key takeaways or insights?'
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
              disabled={isSubmitting || unitsDelta <= 0}
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
