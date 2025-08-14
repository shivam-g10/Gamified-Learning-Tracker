import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Flame } from 'lucide-react';

interface StreakCardProps {
  streak: number;
  onDailyCheckIn: () => void;
}

export function StreakCard({ streak, onDailyCheckIn }: StreakCardProps) {
  return (
    <Card className='bg-card border-border'>
      <CardContent className='p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex-1'>
            <div className='text-sm text-muted-foreground mb-1'>Streak</div>
            <div className='flex items-center gap-2 mb-2'>
              <div className='text-2xl font-bold text-foreground'>{streak}</div>
              <Flame className='w-6 h-6 text-secondary flame-breathe' />
            </div>
            <div className='text-xs text-muted-foreground'>
              🔥 Keep it going!
            </div>
          </div>

          <Button
            onClick={onDailyCheckIn}
            variant='outline'
            size='sm'
            className='bg-secondary/10 border-secondary/20 text-secondary hover:bg-secondary/20 hover:border-secondary/40'
          >
            Check-in
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
