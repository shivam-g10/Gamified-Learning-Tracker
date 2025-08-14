import { Quest } from '@/lib/types';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
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
    <div className='flex items-center gap-4 py-4 px-3 rounded-lg hover:bg-neutral-900/30 transition-all duration-200 group border-b border-neutral-800/50 last:border-b-0'>
      <input
        type='checkbox'
        checked={quest.done}
        onChange={() => onToggleDone(quest)}
        className='w-4 h-4 rounded border-neutral-600 bg-neutral-800 text-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-0 transition-all duration-200'
      />

      <div className='flex-1 min-w-0'>
        <div
          className={`font-medium transition-all duration-200 ${quest.done ? 'line-through text-neutral-500' : 'text-neutral-100'}`}
        >
          {quest.title}
        </div>
        <div className='flex items-center gap-2 mt-1'>
          <Badge
            variant='secondary'
            className='bg-neutral-800 text-neutral-300 border-neutral-700'
          >
            {quest.category}
          </Badge>
          <Badge
            variant='secondary'
            className='bg-neutral-800 text-neutral-300 border-neutral-700'
          >
            {quest.type}
          </Badge>
          <Badge variant='default' className='bg-emerald-600 text-white'>
            +{quest.xp} XP
          </Badge>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <Button
          onClick={() => onToggleFocus(quest)}
          variant={isInFocus ? 'default' : 'outline'}
          size='sm'
          className={isInFocus ? 'bg-indigo-600 hover:bg-indigo-500' : ''}
        >
          <Target className='w-4 h-4 mr-1' />
          {isInFocus ? 'Focused' : 'Focus'}
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
