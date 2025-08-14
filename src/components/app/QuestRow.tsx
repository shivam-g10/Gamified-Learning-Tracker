import { useState, useEffect } from 'react';
import { Quest } from '../../lib/types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Target, Trash2, CheckCircle } from 'lucide-react';

interface QuestRowProps {
  quest: Quest;
  isInFocus: boolean;
  onToggleDone: (quest: Quest) => void;
  onToggleFocus: (quest: Quest) => void;
  onDelete: (quest: Quest) => void;
}

export function QuestRow({
  quest,
  isInFocus,
  onToggleDone,
  onToggleFocus,
  onDelete,
}: QuestRowProps) {
  const [showXpGain, setShowXpGain] = useState(false);
  const [wasCompleted, setWasCompleted] = useState(quest.done);

  // Handle quest completion animation
  useEffect(() => {
    if (quest.done && !wasCompleted) {
      setShowXpGain(true);
      setTimeout(() => setShowXpGain(false), 250);
      setWasCompleted(true);
    }
  }, [quest.done, wasCompleted]);

  return (
    <div
      className={`
      relative flex items-center gap-4 py-4 px-3 hover:bg-muted/30 transition-all duration-200 group border-b border-border last:border-b-0
      ${quest.done ? 'opacity-75' : ''}
    `}
    >
      {/* XP Stripe */}
      <div className='w-1 h-12 bg-secondary rounded-full flex-shrink-0' />

      {/* Checkbox */}
      <div className='flex-shrink-0'>
        <input
          type='checkbox'
          checked={quest.done}
          onChange={() => onToggleDone(quest)}
          className='w-5 h-5 rounded border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-0 transition-all duration-200'
        />
      </div>

      {/* Quest Content */}
      <div className='flex-1 min-w-0'>
        <div
          className={`font-medium text-base transition-all duration-200 line-clamp-2 ${
            quest.done
              ? 'line-through text-muted-foreground'
              : 'text-foreground'
          }`}
        >
          {quest.title}
        </div>

        {/* Quest Metadata */}
        <div className='flex items-center gap-2 mt-2 flex-wrap'>
          <Badge variant='outline' className='text-xs'>
            {quest.category}
          </Badge>
          <Badge variant='outline' className='text-xs'>
            {quest.type}
          </Badge>
          <Badge
            variant='default'
            className='bg-secondary text-secondary-foreground text-xs'
          >
            +{quest.xp} XP
          </Badge>

          {/* Focus indicator */}
          {isInFocus && (
            <Badge
              variant='outline'
              className='text-xs border-primary/30 text-primary'
            >
              🎯 Focused
            </Badge>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className='flex items-center gap-2 flex-shrink-0'>
        <Button
          onClick={() => onToggleFocus(quest)}
          variant={isInFocus ? 'default' : 'outline'}
          size='sm'
          className={`
            ${
              isInFocus
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/40'
            }
          `}
        >
          <Target className='w-4 h-4 mr-1' />
          {isInFocus ? 'Unfocus' : 'Focus'}
        </Button>

        <Button
          onClick={() => onDelete(quest)}
          variant='ghost'
          size='sm'
          className='opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20'
        >
          <Trash2 className='w-4 h-4' />
        </Button>
      </div>

      {/* XP Gain Animation */}
      {showXpGain && (
        <div className='absolute top-2 right-2 xp-float'>
          <div className='bg-secondary text-secondary-foreground text-sm px-3 py-1 rounded-full font-medium flex items-center gap-1'>
            <CheckCircle className='w-4 h-4' />+{quest.xp} XP
          </div>
        </div>
      )}
    </div>
  );
}
