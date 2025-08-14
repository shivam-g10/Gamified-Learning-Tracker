import { Quest } from '../../lib/types';
import { QuestService } from '../../services';

interface CategoryProgressProps {
  quests: Quest[];
}

export function CategoryProgress({ quests }: CategoryProgressProps) {
  const categoryProgress = QuestService.getCategoryProgress(quests);

  // Define better progress colors that look good when filled
  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-success/60'; // More subtle when full
    if (percentage >= 75) return 'bg-accent/70';
    if (percentage >= 50) return 'bg-secondary/70';
    if (percentage >= 25) return 'bg-primary/70';
    return 'bg-muted-foreground/30';
  };

  return (
    <div className='space-y-4'>
      {categoryProgress.map(({ category, percentage }) => (
        <div key={category} className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span className='text-foreground font-medium'>{category}</span>
            <span className='text-muted-foreground font-medium'>
              {percentage}%
            </span>
          </div>

          {/* Custom Progress Bar */}
          <div className='relative'>
            {/* Background Track */}
            <div className='w-full h-2 bg-muted/50 rounded-full overflow-hidden'>
              {/* Progress Fill */}
              <div
                className={`h-full ${getProgressColor(percentage)} transition-all duration-300 ease-out rounded-full`}
                style={{ width: `${percentage}%` }}
              />
            </div>

            {/* Percentage Ticks - Only show if there's progress */}
            {percentage > 0 && (
              <div className='absolute inset-0 flex justify-between items-center pointer-events-none'>
                {[25, 50, 75, 100].map(tick => (
                  <div
                    key={tick}
                    className={`w-0.5 h-2 rounded-full ${
                      percentage >= tick ? 'bg-foreground/10' : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {categoryProgress.length === 0 && (
        <div className='text-center py-6 text-muted-foreground'>
          <div className='text-2xl mb-2'>📊</div>
          <div className='text-sm'>No categories yet</div>
          <div className='text-xs text-muted-foreground/70 mt-1'>
            Add quests to see your progress
          </div>
        </div>
      )}
    </div>
  );
}
