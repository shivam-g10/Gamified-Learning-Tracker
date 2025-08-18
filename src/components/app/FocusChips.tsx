import { useState } from 'react';
import { Quest, AppState } from '../../lib/types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { X, Target, Info, ChevronDown, ChevronRight, Eye } from 'lucide-react';
import { AppStateService } from '../../services';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

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
  const [expandedQuests, setExpandedQuests] = useState<Set<string>>(new Set());

  if (!appState) return null;

  const focusSet = new Set(appState.focus || []);
  const focusQuests = quests.filter(q => focusSet.has(q.id));
  const focusCount = AppStateService.getFocusCount(appState.focus || []);

  const toggleQuestExpansion = (questId: string) => {
    const newExpanded = new Set(expandedQuests);
    if (newExpanded.has(questId)) {
      newExpanded.delete(questId);
    } else {
      newExpanded.add(questId);
    }
    setExpandedQuests(newExpanded);
  };

  // Function to get a truncated description preview
  const getDescriptionPreview = (
    description: string,
    maxLength: number = 80
  ) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  return (
    <div className='space-y-3'>
      {/* Focus Quests - Compact Grid Layout */}
      {focusQuests.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
          {focusQuests.map(q => {
            const hasDescription =
              q.description && q.description.trim().length > 0;
            const isExpanded = expandedQuests.has(q.id);

            return (
              <div
                key={q.id}
                className='group relative p-3 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg hover:from-primary/10 hover:to-primary/15 transition-all duration-200'
              >
                {/* Quest Title and Description Toggle */}
                <div className='flex items-start justify-between gap-2 mb-2'>
                  <div className='font-medium text-foreground text-sm line-clamp-2 flex-1'>
                    {q.title}
                  </div>

                  {/* Description Toggle Button */}
                  {hasDescription && (
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => toggleQuestExpansion(q.id)}
                      className='p-1 h-5 w-5 hover:bg-primary/30 transition-all duration-200 flex-shrink-0'
                    >
                      {isExpanded ? (
                        <ChevronDown className='w-3 h-3' />
                      ) : (
                        <ChevronRight className='w-3 h-3' />
                      )}
                    </Button>
                  )}
                </div>

                {/* Description Summary Preview */}
                {hasDescription && (
                  <div className='mb-2'>
                    <div className='flex items-start justify-between gap-2'>
                      <div className='flex items-start gap-1.5 flex-1'>
                        <div className='text-xs text-primary/80 leading-relaxed line-clamp-2'>
                          {getDescriptionPreview(q.description!, 60)}
                        </div>
                      </div>

                      {/* View Full Description Button */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='p-1 h-4 w-4 hover:bg-primary/30 transition-all duration-200 flex-shrink-0 text-primary/70 hover:text-primary'
                          >
                            <Eye className='w-3 h-3' />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className='sm:max-w-[500px] w-full max-w-full'>
                          <DialogHeader>
                            <DialogTitle className='text-lg'>
                              {q.title}
                            </DialogTitle>
                            <DialogDescription className='text-sm text-muted-foreground'>
                              Quest Details
                            </DialogDescription>
                          </DialogHeader>
                          <div className='space-y-4 w-full min-w-0'>
                            {/* Quest Metadata */}
                            <div className='flex items-center gap-2 flex-wrap w-full min-w-0'>
                              <Badge
                                variant='outline'
                                className='text-xs border-primary/30 text-primary'
                              >
                                {q.category}
                              </Badge>
                              <Badge
                                variant='outline'
                                className='text-xs border-accent/30 text-accent'
                              >
                                {q.type}
                              </Badge>
                              <Badge
                                variant='default'
                                className='bg-secondary text-secondary-foreground text-xs'
                              >
                                +{q.xp} XP
                              </Badge>
                            </div>

                            {/* Full Description */}
                            <div className='space-y-2 w-full min-w-0'>
                              <h4 className='font-medium text-sm text-foreground'>
                                Description
                              </h4>
                              <div className='p-3 bg-muted/20 rounded-lg border border-muted-foreground/20 w-full min-w-0 overflow-hidden'>
                                <p className='text-sm text-muted-foreground leading-relaxed w-full min-w-0'>
                                  {q.description}
                                </p>
                              </div>
                            </div>

                            {/* Focus Status */}
                            <div className='flex items-center gap-2 text-sm text-primary/70 bg-primary/5 p-2 rounded border border-primary/20'>
                              <Target className='w-4 h-4' />
                              <span>Currently focused for learning</span>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                )}

                {/* Quest Description (Expanded View) */}
                {hasDescription && isExpanded && (
                  <div className='mb-2 p-2 bg-primary/10 rounded border border-primary/20'>
                    <div className='flex items-start gap-1.5'>
                      <Info className='w-3 h-3 text-primary/70 mt-0.5 flex-shrink-0' />
                      <div className='text-xs text-primary/80 leading-relaxed'>
                        {q.description}
                      </div>
                    </div>
                  </div>
                )}

                {/* Quest Badges */}
                <div className='flex items-center gap-1.5 mb-2 flex-wrap'>
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
                  className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 hover:bg-primary/30 hover:text-primary active:bg-primary/40 focus:bg-primary/30 focus:ring-1 focus:ring-ring focus:ring-offset-2 rounded-full p-1 h-6 w-6 transition-all duration-200'
                >
                  <X className='w-3 h-3' />
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className='text-center py-6 text-muted-foreground'>
          <div className='text-2xl mb-2'>🎯</div>
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
