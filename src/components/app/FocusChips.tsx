import { Quest, AppState } from '../../lib/types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { X, Target } from 'lucide-react';
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
    <div className='space-y-3'>
      {/* Focus Quests - Compact Grid Layout */}
      {focusQuests.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
          {focusQuests.map(q => (
            <div
              key={q.id}
              className='group relative p-3 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg hover:from-primary/10 hover:to-primary/15 transition-all duration-200'
            >
              {/* Quest Title */}
              <div className='font-medium text-foreground text-sm mb-2 line-clamp-2'>
                {q.title}
              </div>

              {/* Quest Badges */}
              <div className='flex items-center gap-1.5 mb-3 flex-wrap'>
                <Badge
                  variant='outline'
                  className='text-xs border-primary/30 text-primary px-1.5 py-0.5 h-5'
                >
                  {q.category}
                </Badge>
                <Badge
                  variant='outline'
                  className='text-xs border-accent/30 text-accent px-1.5 py-0.5 h-5'
                >
                  {q.type}
                </Badge>
                <Badge
                  variant='default'
                  className='bg-secondary text-secondary-foreground text-xs px-1.5 py-0.5 h-5'
                >
                  +{q.xp} XP
                </Badge>
              </div>

              {/* Focus Indicator */}
              <div className='flex items-center gap-1.5 text-xs text-primary/70'>
                <Target className='w-3 h-3' />
                <span>Focused</span>
              </div>

              {/* Remove Button */}
              <Button
                onClick={() => onToggleFocus(q)}
                variant='ghost'
                size='sm'
                className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 hover:bg-primary/30 hover:text-primary active:bg-primary/40 focus:bg-primary/30 focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full p-1 h-6 w-6 transition-all duration-200'
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
        <div className='text-xs text-muted-foreground text-center py-2 bg-muted/30 rounded-lg border border-muted-foreground/20'>
          Focus queue is full. Remove a quest to add another.
        </div>
      )}
    </div>
  );
}
