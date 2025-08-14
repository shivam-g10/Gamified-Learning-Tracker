import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Target } from 'lucide-react';
import { XPService, AppStateService } from '../../services';

interface OverviewProps {
  totalXp: number;
  streak: number;
  lastCheckIn: string | null;
  onRandomChallenge: () => void;
  onDailyCheckIn: () => void;
}

export function Overview({
  totalXp,
  streak,
  lastCheckIn,
  onRandomChallenge,
  onDailyCheckIn,
}: OverviewProps) {
  const levelInfo = XPService.calculateLevelInfo(totalXp);

  return (
    <Card>
      <div className='flex items-center justify-between p-6 pb-0'>
        <h2 className='text-lg font-semibold'>Overview</h2>
        <Button onClick={onRandomChallenge} variant='outline' size='sm'>
          <Target className='h-4 w-4 mr-2' />
          Random challenge
        </Button>
      </div>
      <CardContent className='pt-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Card>
            <CardContent className='pt-6'>
              <div className='text-sm text-neutral-400'>Level</div>
              <div className='text-2xl font-bold'>{levelInfo.level}</div>
              <div className='h-2 bg-neutral-800 rounded mt-2'>
                <div
                  className='h-2 bg-emerald-500 rounded'
                  style={{ width: `${levelInfo.pct}%` }}
                />
              </div>
              <div className='text-xs text-neutral-400 mt-1'>
                {XPService.getLevelProgressString(totalXp)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='text-sm text-neutral-400'>Streak</div>
              <div className='text-2xl font-bold'>{streak}🔥</div>
              <Button
                className='mt-2'
                onClick={onDailyCheckIn}
                variant='outline'
                size='sm'
              >
                Daily check-in
              </Button>
              <div className='text-xs text-neutral-500 mt-1'>
                Last: {AppStateService.formatLastCheckIn(lastCheckIn)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='text-sm text-neutral-400'>Total XP</div>
              <div className='text-2xl font-bold'>{totalXp}</div>
              <div className='text-xs text-neutral-400 mt-1'>
                {XPService.getTotalXpString(totalXp)}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
