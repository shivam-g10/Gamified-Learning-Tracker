import { Quest, AppState } from '../../lib/types';
import { Button } from '../ui/button';
import { AppStateService } from '../../services';

interface FocusChipsProps {
  quests: Quest[];
  appState: AppState | null;
  onToggleFocus: (quest: Quest) => void;
}

export function FocusChips({
  quests,
  appState,
  onToggleFocus,
}: FocusChipsProps) {
  if (!appState) return null;

  const focusSet = new Set(appState.focus || []);
  const focusQuests = quests.filter(q => focusSet.has(q.id));

  return (
    <div className='space-y-4'>
      {/* Focus Status */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-muted-foreground'>Current focus:</span>
          <span className='text-sm font-medium text-foreground'>
            {AppStateService.getFocusCount(appState.focus || [])}/3
          </span>
        </div>
        {focusQuests.length === 0 && (
          <span className='text-xs text-muted-foreground italic'>
            Select quests to focus on
          </span>
        )}
      </div>

      {/* Focus Quests */}
      {focusQuests.length > 0 ? (
        <div className='space-y-2'>
          {focusQuests.map(q => (
            <div
              key={q.id}
              className='flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border hover:bg-muted transition-colors'
            >
              <div className='flex-1 min-w-0'>
                <div className='font-medium text-foreground text-sm truncate'>
                  {q.title}
                </div>
                <div className='text-xs text-muted-foreground mt-1'>
                  {q.category} • +{q.xp} XP
                </div>
              </div>
              <Button
                onClick={() => onToggleFocus(q)}
                variant='outline'
                size='sm'
                className='ml-2'
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-6 text-muted-foreground'>
          <div className='text-2xl mb-2'>🎯</div>
          <div className='text-sm'>No quests focused</div>
          <div className='text-xs text-muted-foreground/70 mt-1'>
            Focus on up to 3 quests to prioritize your learning
          </div>
        </div>
      )}
    </div>
  );
}
