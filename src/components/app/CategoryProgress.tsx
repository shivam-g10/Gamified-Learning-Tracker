import { Quest } from '../../lib/types';
import { QuestService } from '../../services';
import { Progress } from '../ui/progress';

interface CategoryProgressProps {
  quests: Quest[];
}

export function CategoryProgress({ quests }: CategoryProgressProps) {
  const categoryProgress = QuestService.getCategoryProgress(quests);

  return (
    <div className='space-y-4'>
      {categoryProgress.map(({ category, percentage }) => (
        <div key={category} className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span className='text-foreground font-medium'>{category}</span>
            <span className='text-muted-foreground'>{percentage}%</span>
          </div>
          <Progress value={percentage} className='h-2' />
        </div>
      ))}
    </div>
  );
}
