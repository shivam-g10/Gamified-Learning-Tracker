import { Quest, AppState } from '../../lib/types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { X } from 'lucide-react';
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
  const focusCount = AppStateService.getFocusCount(appState.focus || []);

  return (
    <div className='space-y-4'>
      {/* Focus Quests - Capsule Style */}
      {focusQuests.length > 0 ? (
        <div className='space-y-3'>
          {focusQuests.map(q => (
            <div
              key={q.id}
              className='flex items-center gap-2 p-2 bg-primary/5 border border-primary/20 rounded-lg hover:bg-primary/10 transition-colors group'
            >
              {/* Quest Info */}
              <div className='flex-1 min-w-0'>
                <div className='font-medium text-foreground text-xs truncate'>
                  {q.title}
                </div>
                <div className='flex items-center gap-1 mt-1'>
                  <Badge
                    variant='outline'
                    className='text-xs border-primary/30 text-primary px-1 py-0 h-4'
                  >
                    {q.category}
                  </Badge>
                  <Badge
                    variant='outline'
                    className='text-xs border-accent/30 text-accent px-1 py-0 h-4'
                  >
                    {q.type}
                  </Badge>
                  <Badge
                    variant='default'
                    className='bg-secondary text-secondary-foreground text-xs px-1 py-0 h-4'
                  >
                    +{q.xp} XP
                  </Badge>
                </div>
              </div>

              {/* Remove Button */}
              <Button
                onClick={() => onToggleFocus(q)}
                variant='ghost'
                size='sm'
                className='opacity-0 group-hover:opacity-100 hover:bg-primary/20 hover:text-primary rounded-full p-1 h-6 w-6'
              >
                <X className='w-3 h-3' />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-8 text-muted-foreground'>
          <div className='text-3xl mb-3'>🎯</div>
          <div className='text-sm font-medium mb-1'>No quests focused</div>
          <div className='text-xs text-muted-foreground/70'>
            Focus on up to 3 quests to prioritize your learning
          </div>
        </div>
      )}

      {/* Focus Limit Warning */}
      {focusCount >= 3 && (
        <div className='text-xs text-muted-foreground text-center py-2 bg-muted/30 rounded-lg'>
          Focus queue is full. Remove a quest to add another.
        </div>
      )}
    </div>
  );
}
