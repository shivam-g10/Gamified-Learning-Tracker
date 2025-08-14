import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Target, Sparkles } from 'lucide-react';
import { XPService } from '../../services';

interface LevelCardProps {
  totalXp: number;
  onRandomChallenge: () => void;
}

export function LevelCard({ totalXp, onRandomChallenge }: LevelCardProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(0);

  const { level, progress, nextLevelXp, pct } =
    XPService.totalXpToLevel(totalXp);

  // Check for level up
  useEffect(() => {
    if (level > previousLevel && previousLevel > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
    }
    setPreviousLevel(level);
  }, [level, previousLevel]);

  return (
    <Card className='bg-card border-border relative overflow-hidden'>
      <CardContent className='p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex-1'>
            <div className='text-sm text-muted-foreground mb-1'>Level</div>
            <div className='text-2xl font-bold text-foreground mb-2'>
              {level}
            </div>

            {/* Progress Bar */}
            <div className='mb-2'>
              <div className='flex justify-between text-xs text-muted-foreground mb-1'>
                <span>{progress} XP</span>
                <span>{nextLevelXp} XP</span>
              </div>
              <div className='relative'>
                <Progress value={pct} className='h-2 rounded-full bg-muted' />
                <div
                  className='absolute inset-0 rounded-full progress-shimmer'
                  style={{
                    background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)`,
                    backgroundSize: '200% 100%',
                  }}
                />
              </div>
            </div>

            <div className='text-xs text-muted-foreground'>
              {progress}/{nextLevelXp} XP to next level
            </div>
          </div>

          <div className='flex flex-col items-end gap-2'>
            <Button
              onClick={onRandomChallenge}
              variant='outline'
              size='sm'
              className='bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 hover:border-primary/40'
            >
              <Target className='w-4 h-4 mr-1' />
              Challenge
            </Button>

            {/* Level up indicator */}
            {showConfetti && (
              <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                <div className='text-4xl animate-pulse'>
                  <Sparkles className='text-secondary' />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
