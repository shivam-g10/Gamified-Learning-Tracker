import { Quest } from '@/lib/types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Target, Trash2 } from 'lucide-react';

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
  return (
    <div className='flex items-center gap-4 py-4 px-3 hover:bg-muted/50 transition-all duration-200 group border-b border-border last:border-b-0'>
      <input
        type='checkbox'
        checked={quest.done}
        onChange={() => onToggleDone(quest)}
        className='w-4 h-4 rounded border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-0 transition-all duration-200'
      />

      <div className='flex-1 min-w-0'>
        <div
          className={`font-medium transition-all duration-200 ${quest.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}
        >
          {quest.title}
        </div>
        <div className='flex items-center gap-2 mt-1'>
          <Badge variant='secondary'>{quest.category}</Badge>
          <Badge variant='secondary'>{quest.type}</Badge>
          <Badge variant='default'>+{quest.xp} XP</Badge>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        {/* Focus Badge - More Prominent */}
        {isInFocus && (
          <Badge variant='outline' className='px-2 py-1 text-xs font-medium'>
            🎯 Focused
          </Badge>
        )}

        <Button
          onClick={() => onToggleFocus(quest)}
          variant={isInFocus ? 'default' : 'outline'}
          size='sm'
        >
          <Target className='w-4 h-4 mr-1' />
          {isInFocus ? 'Unfocus' : 'Focus'}
        </Button>

        <Button
          onClick={() => onDelete(quest)}
          variant='outline'
          size='icon'
          className='opacity-0 group-hover:opacity-100 hover:bg-red-900/30 hover:text-red-400 hover:border-red-700/50'
        >
          <Trash2 className='w-4 h-4' />
        </Button>
      </div>
    </div>
  );
}
