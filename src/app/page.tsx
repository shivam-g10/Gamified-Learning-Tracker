'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Quest } from '../lib/types';
import { useQuests, useAppState } from '../lib/hooks';
import {
  QuestService,
  AppStateService,
  CreateQuestData,
  CategoryBadgeService,
} from '../services';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { Flame, Sparkles, ChevronDown, Dice6 } from 'lucide-react';
import {
  FocusChips,
  AddQuestDialog,
  QuestRow,
  SearchAndFilters,
} from '../components/app';

export default function HomePage() {
  const { quests, mutateQuests } = useQuests();
  const { appState, mutateState } = useAppState();

  // State management for search, filters, and sorting
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState<
    'title' | 'xp' | 'category' | 'type' | 'created_at' | 'done'
  >('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [previousTotalXp, setPreviousTotalXp] = useState(0);

  // Calculated values using services
  const totalXp = useMemo(
    () => QuestService.calculateTotalXp(quests || []),
    [quests]
  );

  const categories = useMemo(
    () => QuestService.getUniqueCategories(quests || []),
    [quests]
  );

  const filtered = useMemo(() => {
    const filteredQuests = QuestService.filterQuests(
      quests || [],
      search,
      filterType,
      filterCategory
    );

    return QuestService.sortQuests(filteredQuests, sortBy, sortOrder);
  }, [quests, search, filterType, filterCategory, sortBy, sortOrder]);

  // Track XP changes for animations
  useEffect(() => {
    if (totalXp !== previousTotalXp) {
      setPreviousTotalXp(totalXp);
    }
  }, [totalXp, previousTotalXp]);

  // Calculate level info using service
  const levelInfo = useMemo(() => {
    const level = Math.floor(totalXp / 150) + 1;
    const progress = totalXp % 150;
    const nextLevelXp = 150;
    const pct = Math.round((progress / nextLevelXp) * 100);
    return { level, progress, nextLevelXp, pct };
  }, [totalXp]);

  // Calculate badge thresholds using service
  const badgeThresholds = useMemo(() => {
    const thresholds = [150, 400, 800, 1200, 2000];
    return thresholds.map(threshold => ({
      threshold,
      name:
        threshold === 150
          ? 'Bronze'
          : threshold === 400
            ? 'Silver'
            : threshold === 800
              ? 'Gold'
              : threshold === 1200
                ? 'Epic'
                : 'Legendary',
      earned: totalXp >= threshold,
      color:
        threshold === 150
          ? 'bg-amber-600'
          : threshold === 400
            ? 'bg-gray-500'
            : threshold === 800
              ? 'bg-yellow-500'
              : threshold === 1200
                ? 'bg-purple-600'
                : 'bg-orange-600',
    }));
  }, [totalXp]);

  // Calculate category progress and badges using service
  const categoryProgress = useMemo(() => {
    return CategoryBadgeService.getCategoryProgress(quests || []);
  }, [quests]);

  // Event handlers using services
  const handleAddQuest = useCallback(
    async (data: CreateQuestData) => {
      try {
        await QuestService.createQuest(data);
        await mutateQuests();
      } catch (error) {
        console.error('Failed to add quest:', error);
      }
    },
    [mutateQuests]
  );

  const handleToggleDone = useCallback(
    async (quest: Quest) => {
      try {
        await QuestService.toggleQuestCompletion(quest.id, quest.done);
        await mutateQuests();
      } catch (error) {
        console.error('Failed to toggle quest completion:', error);
      }
    },
    [mutateQuests]
  );

  const handleDeleteQuest = useCallback(
    async (quest: Quest) => {
      try {
        await QuestService.deleteQuest(quest.id);
        await mutateQuests();
      } catch (error) {
        console.error('Failed to delete quest:', error);
      }
    },
    [mutateQuests]
  );

  const handleToggleFocus = useCallback(
    async (quest: Quest) => {
      if (!appState) return;

      try {
        await AppStateService.toggleQuestFocus(quest.id, appState.focus || []);
        await mutateState();
      } catch (error) {
        console.error('Failed to toggle quest focus:', error);
      }
    },
    [appState, mutateState]
  );

  const handleDailyCheckIn = useCallback(async () => {
    try {
      await AppStateService.recordDailyCheckIn();
      await mutateState();
      // Show success toast
      console.log('🔥 Streak +1 — see you tomorrow!');
    } catch (error) {
      console.error('Failed to record daily check-in:', error);
    }
  }, [mutateState]);

  const handleRandomChallenge = useCallback(async () => {
    try {
      const challenge = await QuestService.getRandomChallenge();
      if (!challenge) {
        alert('All quests are done — nice!');
        return;
      }
      alert(
        `Random Challenge:\n${challenge.title} [${challenge.category}] (+${challenge.xp} XP)`
      );
    } catch (error) {
      console.error('Failed to get random challenge:', error);
    }
  }, []);

  // Check if quest is in focus
  const isQuestInFocus = useCallback(
    (questId: string): boolean => {
      if (!appState) return false;
      return AppStateService.isQuestInFocus(questId, appState.focus || []);
    },
    [appState]
  );

  return (
    <div className='space-y-6'>
      {/* Compact Overview Section */}
      <Card>
        <CardHeader className='pb-4'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-lg'>Learning Progress</CardTitle>
            <div className='flex items-center gap-2'>
              {/* Streak Display */}
              <div className='flex items-center gap-2 px-3 py-1 bg-muted/30 rounded-lg'>
                <Flame className='w-4 h-4 text-secondary' />
                <span className='text-sm font-medium text-foreground'>
                  {appState?.streak || 0}
                </span>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleDailyCheckIn}
                      variant='outline'
                      size='sm'
                      className={`transition-all duration-200 focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                        appState?.last_check_in &&
                        new Date(appState.last_check_in).toDateString() ===
                          new Date().toDateString()
                          ? 'bg-muted/30 border-muted-foreground/30 text-muted-foreground hover:bg-muted/50 hover:border-muted-foreground/50 active:bg-muted/70'
                          : 'bg-secondary text-secondary-foreground border-secondary shadow-lg shadow-secondary/20 hover:bg-secondary/90 active:bg-secondary/80 focus:bg-secondary/90'
                      }`}
                    >
                      <Flame
                        className={`w-4 h-4 mr-1 transition-all duration-200 ${
                          appState?.last_check_in &&
                          new Date(appState.last_check_in).toDateString() ===
                            new Date().toDateString()
                            ? 'text-secondary animate-pulse'
                            : 'text-white'
                        }`}
                      />
                      Check-in
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {appState?.last_check_in &&
                      new Date(appState.last_check_in).toDateString() ===
                        new Date().toDateString()
                        ? 'Already checked in today! 🔥'
                        : 'Record your daily learning progress'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleRandomChallenge}
                      variant='outline'
                      size='sm'
                      className='bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 hover:border-primary/40 active:bg-primary/30 focus:bg-primary/20 focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200'
                    >
                      <Dice6 className='w-4 h-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Get a random challenge</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Main Progress Bar */}
          <div className='space-y-3'>
            <div className='flex justify-between items-center'>
              <div className='flex items-center gap-3'>
                <div className='text-2xl font-bold text-foreground'>
                  Level {levelInfo.level}
                </div>
                <div className='text-sm text-muted-foreground'>
                  {levelInfo.progress}/{levelInfo.nextLevelXp} XP to next level
                </div>
              </div>
              <div className='text-right'>
                <div className='text-xl font-bold text-foreground'>
                  {totalXp}
                </div>
                <div className='text-sm text-muted-foreground'>Total XP</div>
              </div>
            </div>

            {/* Prominent Progress Bar */}
            <div className='relative'>
              <Progress
                value={levelInfo.pct}
                className='h-3 rounded-full bg-muted'
              />
              <div
                className='absolute inset-0 rounded-full progress-shimmer'
                style={{
                  background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)`,
                  backgroundSize: '200% 100%',
                }}
              />
            </div>
          </div>

          {/* Badges Section */}
          <div className='border-t pt-4'>
            <div className='flex items-center gap-2 mb-3'>
              <span className='text-sm font-medium text-foreground'>
                Badges
              </span>
              <Sparkles className='w-4 h-4 text-accent' />
            </div>
            <div className='flex flex-wrap gap-2'>
              {badgeThresholds
                .filter(({ earned }) => earned)
                .map(({ threshold, name, earned, color }) => (
                  <div
                    key={threshold}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                      earned
                        ? `${color} text-white border-0`
                        : 'bg-muted text-muted-foreground border border-muted-foreground/20'
                    }`}
                  >
                    {name}
                    {earned && (
                      <Sparkles className='w-3 h-3 text-white ml-1 inline' />
                    )}
                  </div>
                ))}
              {badgeThresholds.filter(({ earned }) => earned).length === 0 && (
                <div className='text-sm text-muted-foreground italic'>
                  No badges earned yet. Keep learning to unlock your first
                  badge!
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Focus Panel */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            🎯 Focus
            <span className='text-sm font-normal text-muted-foreground'>
              ({AppStateService.getFocusCount(appState?.focus || [])}/3)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FocusChips
            quests={quests || []}
            appState={appState || null}
            onToggleFocus={handleToggleFocus}
          />
        </CardContent>
      </Card>

      {/* Quests List with Add Quest and Category Progress */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='text-lg font-semibold'>Quests</span>
              {sortBy !== 'created_at' && (
                <span className='text-sm text-muted-foreground font-normal'>
                  (sorted by {sortBy} {sortOrder === 'asc' ? '↑' : '↓'})
                </span>
              )}
            </div>
            <AddQuestDialog onSubmit={handleAddQuest} />
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <SearchAndFilters
            search={search}
            filterType={filterType}
            filterCategory={filterCategory}
            sortBy={sortBy}
            sortOrder={sortOrder}
            categories={categories}
            onSearchChange={setSearch}
            onFilterTypeChange={setFilterType}
            onFilterCategoryChange={setFilterCategory}
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
          />

          {/* Category Progress Summary with Accordion */}
          <Accordion type='single' collapsible className='w-full'>
            <AccordionItem
              value='category-progress'
              className='border rounded-lg data-[state=open]:border-primary/40 data-[state=open]:shadow-[0_0_0_1px_rgba(33,230,182,0.4)] data-[state=open]:shadow-primary/20 transition-all duration-200'
            >
              <AccordionTrigger className='px-4 py-3 hover:no-underline data-[state=open]:text-primary'>
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-medium text-foreground'>
                    Category Progress
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    • Overall completion
                  </span>
                  <ChevronDown className='w-4 h-4 text-muted-foreground transition-transform duration-200' />
                </div>
              </AccordionTrigger>
              <AccordionContent className='px-4 pb-4 pt-6'>
                <div className='space-y-4'>
                  {/* Category Progress Grid */}
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                    {categoryProgress.map(({ category, percentage }) => (
                      <div key={category} className='text-center'>
                        <div className='text-xs text-muted-foreground mb-1'>
                          {category}
                        </div>
                        <div className='text-lg font-bold text-foreground'>
                          {percentage}%
                        </div>
                        <div className='w-full h-1.5 bg-muted rounded-full mt-1'>
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              percentage >= 100
                                ? 'bg-success'
                                : percentage >= 75
                                  ? 'bg-accent'
                                  : percentage >= 50
                                    ? 'bg-secondary'
                                    : percentage >= 25
                                      ? 'bg-primary'
                                      : 'bg-muted-foreground/30'
                            }`}
                            style={{ width: `${Math.max(percentage, 1)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Quest List */}
          <div className='divide-y divide-border bg-muted/30 border border-border overflow-hidden rounded-lg'>
            {filtered?.map((q: Quest) => (
              <QuestRow
                key={q.id}
                quest={q}
                isInFocus={isQuestInFocus(q.id)}
                onToggleDone={handleToggleDone}
                onToggleFocus={handleToggleFocus}
                onDelete={handleDeleteQuest}
              />
            ))}
            {filtered && filtered.length === 0 && (
              <div className='text-center py-12 text-muted-foreground'>
                <div className='text-4xl mb-3'>🎯</div>
                <div className='text-lg font-medium mb-2'>No quests yet</div>
                <div className='text-sm'>
                  Add your first quest to start earning XP
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
