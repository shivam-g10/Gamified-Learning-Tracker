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
      relative flex items-center gap-4 py-4 px-4 hover:bg-muted/20 transition-all duration-200 group border-b border-border last:border-b-0
      ${quest.done ? 'opacity-75 bg-muted/10' : ''}
    `}
    >
      {/* Checkbox */}
      <div className='flex-shrink-0'>
        <input
          type='checkbox'
          checked={quest.done}
          onChange={() => onToggleDone(quest)}
          className='w-5 h-5 rounded border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-0 transition-all duration-200 hover:scale-110'
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
          <Badge
            variant='outline'
            className='text-xs border-primary/20 text-primary'
          >
            {quest.category}
          </Badge>
          <Badge
            variant='outline'
            className='text-xs border-accent/20 text-accent'
          >
            {quest.type}
          </Badge>
          <Badge
            variant='default'
            className='bg-secondary text-secondary-foreground text-xs font-medium'
          >
            +{quest.xp} XP
          </Badge>

          {/* Focus indicator */}
          {isInFocus && (
            <Badge
              variant='outline'
              className='text-xs border-primary/40 text-primary bg-primary/5'
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
            transition-all duration-200 focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
              isInFocus
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 shadow-sm'
                : 'border-primary/20 text-primary hover:bg-primary/20 hover:border-primary/40 active:bg-primary/30 focus:bg-primary/20 hover:shadow-sm'
            }
          `}
        >
          <Target className='h-4 w-4 mr-1' />
          {isInFocus ? 'Unfocus' : 'Focus'}
        </Button>

        <Button
          onClick={() => onDelete(quest)}
          variant='ghost'
          size='sm'
          className='opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive hover:border-destructive/30 active:bg-destructive/30 focus:bg-destructive/20 focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200'
        >
          <Trash2 className='w-4 h-4' />
        </Button>
      </div>

      {/* XP Gain Animation */}
      {showXpGain && (
        <div className='absolute top-2 right-2 xp-float'>
          <div className='bg-secondary text-secondary-foreground text-sm px-3 py-1 rounded-full font-medium flex items-center gap-1 shadow-lg'>
            <CheckCircle className='w-4 h-4' />+{quest.xp} XP
          </div>
        </div>
      )}
    </div>
  );
}
