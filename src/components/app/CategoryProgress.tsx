import { Quest } from '../../lib/types';
import { QuestService } from '../../services';

interface CategoryProgressProps {
  quests: Quest[];
}

export function CategoryProgress({ quests }: CategoryProgressProps) {
  const categoryProgress = QuestService.getCategoryProgress(quests);

  return (
    <div className='space-y-3'>
      {categoryProgress.map(({ category, percentage }) => (
        <div key={category}>
          <div className='flex justify-between text-sm mb-1'>
            <span>{category}</span>
            <span>{percentage}%</span>
          </div>
          <div className='h-2 bg-neutral-800 rounded'>
            <div
              className='h-2 bg-indigo-600 rounded'
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
