'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Quest } from '../lib/types';
import { useQuests, useAppState } from '../lib/hooks';
import { QuestService, AppStateService, CreateQuestData } from '../services';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { Target, Flame } from 'lucide-react';
import {
  Badges,
  FocusChips,
  AddQuestDialog,
  QuestRow,
  SearchAndFilters,
  CategoryProgress,
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

  // Calculate level info
  const levelInfo = useMemo(() => {
    const level = Math.floor(totalXp / 150) + 1;
    const progress = totalXp % 150;
    const nextLevelXp = 150;
    const pct = Math.round((progress / nextLevelXp) * 100);
    return { level, progress, nextLevelXp, pct };
  }, [totalXp]);

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
    <div className='flex gap-6'>
      {/* Main Content - Gamified Layout */}
      <div className='flex-1 space-y-6'>
        {/* Overview Section - Single Block with Prominent Progress */}
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Learning Progress</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Main Progress Bar */}
            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-3'>
                  <div className='text-3xl font-bold text-foreground'>
                    Level {levelInfo.level}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    {levelInfo.progress}/{levelInfo.nextLevelXp} XP to next
                    level
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-2xl font-bold text-foreground'>
                    {totalXp}
                  </div>
                  <div className='text-sm text-muted-foreground'>Total XP</div>
                </div>
              </div>

              {/* Prominent Progress Bar */}
              <div className='relative'>
                <Progress
                  value={levelInfo.pct}
                  className='h-4 rounded-full bg-muted'
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

            {/* Stats Row */}
            <div className='grid grid-cols-3 gap-4'>
              {/* Streak */}
              <div className='text-center p-3 bg-muted/30 rounded-lg'>
                <div className='flex items-center justify-center gap-2 mb-2'>
                  <Flame className='w-5 h-5 text-secondary flame-breathe' />
                  <span className='text-sm font-medium'>Streak</span>
                </div>
                <div className='text-2xl font-bold text-foreground mb-2'>
                  {appState?.streak || 0}
                </div>
                <Button
                  onClick={handleDailyCheckIn}
                  variant='outline'
                  size='sm'
                  className='w-full bg-secondary/10 border-secondary/20 text-secondary hover:bg-secondary/20 hover:border-secondary/40'
                >
                  Check-in
                </Button>
              </div>

              {/* Challenge */}
              <div className='text-center p-3 bg-muted/30 rounded-lg'>
                <div className='flex items-center justify-center gap-2 mb-2'>
                  <Target className='w-5 h-5 text-primary' />
                  <span className='text-sm font-medium'>Challenge</span>
                </div>
                <div className='text-2xl font-bold text-foreground mb-2'>
                  Ready
                </div>
                <Button
                  onClick={handleRandomChallenge}
                  variant='outline'
                  size='sm'
                  className='w-full bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 hover:border-primary/40'
                >
                  Roll Dice
                </Button>
              </div>

              {/* Focus Count */}
              <div className='text-center p-3 bg-muted/30 rounded-lg'>
                <div className='flex items-center justify-center gap-2 mb-2'>
                  <span className='text-lg'>🎯</span>
                  <span className='text-sm font-medium'>Focus</span>
                </div>
                <div className='text-2xl font-bold text-foreground mb-2'>
                  {AppStateService.getFocusCount(appState?.focus || [])}/3
                </div>
                <div className='text-xs text-muted-foreground'>
                  Quests focused
                </div>
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

        {/* Quests List with Add Quest */}
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

      {/* Right Sidebar - Stats & Progress */}
      <div className='w-80 flex-shrink-0 space-y-4'>
        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <Badges totalXp={totalXp} />
          </CardContent>
        </Card>

        {/* Category Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Category Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryProgress quests={quests || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
