import React from 'react';
import { AppState } from '@/lib/types';
import { FocusState } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Flame, Sparkles, Dices } from 'lucide-react';

export interface ProgressOverviewProps {
  levelInfo: {
    level: number;
    progress: number;
    nextLevelXp: number;
    pct: number;
  };
  totalXp: number;
  xpBreakdown: {
    quests: number;
    books: number;
    courses: number;
  };
  badgeThresholds: Array<{
    threshold: number;
    name: string;
    earned: boolean;
    color: string;
  }>;
  appState: AppState | undefined;
  focusState?: FocusState;
  onCheckIn: () => void;
  onRandomChallenge: () => void;
}

/**
 * ProgressOverview component displays the main learning progress overview
 * including level, XP, badges, and action buttons.
 */
export function ProgressOverview({
  levelInfo,
  totalXp,
  xpBreakdown,
  badgeThresholds,
  appState,
  focusState,
  onCheckIn,
  onRandomChallenge,
}: ProgressOverviewProps) {
  const isCheckedInToday =
    appState?.last_check_in &&
    new Date(appState.last_check_in).toDateString() ===
      new Date().toDateString();

  // Calculate focus slot status
  const focusSlotsUsed = [
    focusState?.quest ? 1 : 0,
    focusState?.book ? 1 : 0,
    focusState?.course ? 1 : 0,
  ].reduce((sum, count) => sum + count, 0);

  const allFocusSlotsFull = focusSlotsUsed >= 3;
  const availableFocusSlots = 3 - focusSlotsUsed;

  return (
    <Card>
      <CardHeader className='pb-4'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg'>Learning Progress</CardTitle>
          <div className='flex items-center gap-2'>
            {/* Streak Display */}
            <div className='flex items-center gap-2 px-3 py-1 bg-muted/30 rounded-lg'>
              <Flame className='w-4 h-4 text-secondary' />
              <span className='text-sm font-medium text-foreground'>
                {appState?.streak || 0}
              </span>
            </div>

            {/* Check-in Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={onCheckIn}
                    variant='outline'
                    size='sm'
                    className={`transition-all duration-200 focus:ring-1 focus:ring-ring focus:ring-offset-2 ${
                      isCheckedInToday
                        ? 'bg-green-600 text-white border-green-600 hover:bg-green-700'
                        : 'hover:bg-muted/50 hover:border-muted-foreground/50'
                    }`}
                  >
                    Check-in
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isCheckedInToday
                    ? 'Already checked in today!'
                    : 'Record your daily progress'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Random Challenge Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={onRandomChallenge}
                    variant='outline'
                    size='sm'
                    disabled={allFocusSlotsFull}
                    className={`transition-all duration-200 focus:ring-1 focus:ring-ring focus:ring-offset-2 ${
                      allFocusSlotsFull
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-muted/50 hover:border-muted-foreground/50'
                    }`}
                  >
                    <Dices className='w-4 h-4 mr-1' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {allFocusSlotsFull
                    ? 'All focus slots are full. Complete or remove items to get new challenges.'
                    : `Get a random challenge (${availableFocusSlots} slot${availableFocusSlots !== 1 ? 's' : ''} available)`}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Level and XP Display */}
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold text-foreground'>
              Level {levelInfo.level}
            </h2>
            <p className='text-muted-foreground'>
              {levelInfo.progress}/{levelInfo.nextLevelXp} XP to next level
            </p>
          </div>
          <div className='text-right'>
            <div className='text-3xl font-bold text-foreground'>{totalXp}</div>
            <div className='text-sm text-muted-foreground'>Total XP</div>
            {/* XP Breakdown */}
            <div className='text-xs text-muted-foreground/70 mt-1 space-y-0.5'>
              <div>🎯 {xpBreakdown.quests} XP</div>
              <div>📚 {xpBreakdown.books} XP</div>
              <div>🎓 {xpBreakdown.courses} XP</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className='mb-4 rounded-full'>
          <div className='relative progress-shimmer rounded-full'>
            {/* Background Track */}
            <div className='w-full h-3 bg-muted/50 rounded-full overflow-hidden'>
              {/* Progress Fill */}
              <div
                className={`h-full transition-all duration-300 ease-out rounded-full ${
                  levelInfo.pct >= 100
                    ? 'bg-success'
                    : levelInfo.pct >= 75
                      ? 'bg-accent'
                      : levelInfo.pct >= 50
                        ? 'bg-secondary'
                        : levelInfo.pct >= 25
                          ? 'bg-primary'
                          : 'bg-muted-foreground/50'
                }`}
                style={{ width: `${levelInfo.pct}%` }}
              />
            </div>

            {/* Progress Ticks - Only show if there's progress */}
            {levelInfo.pct > 0 && (
              <div className='absolute inset-0 flex justify-between items-center pointer-events-none'>
                {[25, 50, 75, 100].map((tick, i) => (
                  <div
                    key={tick}
                    className={`w-0.5 h-3 rounded-full ${
                      levelInfo.pct >= tick && i !== 0
                        ? 'bg-foreground/20'
                        : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Badges Section - Small and Thin */}
        <div className='pt-2 border-t border-border'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm font-medium text-muted-foreground'>
              Badges
            </span>
            <span className='text-xs text-muted-foreground'>
              {badgeThresholds.filter(b => b.earned).length}/
              {badgeThresholds.length} earned
            </span>
          </div>
          <div className='flex flex-wrap gap-2'>
            {badgeThresholds.map(({ threshold, name, earned, color }) => (
              <div
                key={threshold}
                className={`flex items-center gap-1 px-2 py-1 rounded-md border text-xs ${
                  earned
                    ? `${color} text-white border-transparent`
                    : 'bg-muted/30 border-muted text-muted-foreground'
                }`}
              >
                <span className='font-medium'>{name}</span>
                {earned && <Sparkles className='w-3 h-3 text-white' />}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
