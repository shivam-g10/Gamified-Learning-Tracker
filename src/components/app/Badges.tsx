import { Badge } from '../ui/badge';
import { Sparkles } from 'lucide-react';
import { XPService } from '../../services';

interface BadgesProps {
  totalXp: number;
}

export function Badges({ totalXp }: BadgesProps) {
  const thresholds = XPService.getBadgeThresholds();

  // Get appropriate color for each badge tier
  const getBadgeColor = (threshold: number): string => {
    switch (threshold) {
      case 150:
        return 'bg-amber-600 text-white'; // Bronze
      case 400:
        return 'bg-gray-500 text-white'; // Silver
      case 800:
        return 'bg-yellow-500 text-white'; // Gold
      case 1200:
        return 'bg-purple-600 text-white'; // Epic
      case 2000:
        return 'bg-orange-600 text-white'; // Legendary
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className='space-y-3'>
      <h3 className='text-sm font-medium text-foreground'>Badges</h3>
      <div className='flex flex-wrap gap-2'>
        {thresholds.map(threshold => {
          const hasReached = XPService.hasReachedBadgeThreshold(
            totalXp,
            threshold
          );
          return (
            <Badge
              key={threshold}
              variant={hasReached ? 'default' : 'outline'}
              className={`${
                hasReached
                  ? `${getBadgeColor(threshold)} border-0`
                  : 'bg-muted text-muted-foreground border-muted-foreground/20'
              } transition-colors duration-200`}
            >
              {XPService.getBadgeName(threshold)}
              {hasReached && <Sparkles className='w-3 h-3 text-white ml-1' />}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
