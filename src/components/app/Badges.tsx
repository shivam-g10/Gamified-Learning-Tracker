import { Badge } from '../components/ui/badge';
import { XPService } from '../../services';

interface BadgesProps {
  totalXp: number;
}

export function Badges({ totalXp }: BadgesProps) {
  const thresholds = XPService.getBadgeThresholds();

  return (
    <div className='flex gap-2 flex-wrap'>
      {thresholds.map(threshold => (
        <Badge
          key={threshold}
          variant={
            XPService.hasReachedBadgeThreshold(totalXp, threshold)
              ? 'default'
              : 'secondary'
          }
          className={
            XPService.hasReachedBadgeThreshold(totalXp, threshold)
              ? 'bg-yellow-600 text-white'
              : 'bg-neutral-800 text-neutral-400'
          }
        >
          {threshold} XP
        </Badge>
      ))}
    </div>
  );
}
