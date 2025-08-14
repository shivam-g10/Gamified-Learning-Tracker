import { Quest, AppState } from '../../lib/types';
import { Badge } from '../components/ui/badge';
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
    <div className='space-y-3'>
      <div className='flex items-center gap-2'>
        <span className='text-sm text-neutral-400'>Current focus:</span>
        <span className='text-sm font-medium'>
          {AppStateService.getFocusCount(appState.focus || [])}/3
        </span>
      </div>
      <div className='flex gap-2 flex-wrap'>
        {focusQuests.map(q => (
          <Badge
            key={q.id}
            variant='outline'
            className='bg-indigo-900/30 text-indigo-300 border-indigo-700 cursor-pointer hover:bg-indigo-800/40'
            onClick={() => onToggleFocus(q)}
          >
            {q.title}
          </Badge>
        ))}
      </div>
    </div>
  );
}
