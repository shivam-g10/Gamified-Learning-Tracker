'use client';

import { useState, useMemo, useCallback } from 'react';
import { Quest } from '../lib/types';
import { useQuests, useAppState } from '../lib/hooks';
import { QuestService, AppStateService, CreateQuestData } from '../services';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Target } from 'lucide-react';
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
      {/* Main Content - Prioritized Layout */}
      <div className='flex-1 space-y-6'>
        {/* Compact Overview Row */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Card className='bg-card border-border'>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <div className='text-sm text-muted-foreground mb-1'>
                    Level
                  </div>
                  <div className='text-2xl font-bold text-foreground'>0</div>
                  <div className='text-xs text-muted-foreground'>0/150 XP</div>
                </div>
                <Button
                  onClick={handleRandomChallenge}
                  variant='outline'
                  size='sm'
                >
                  <Target className='w-4 h-4 mr-1' />
                  Challenge
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-card border-border'>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <div className='text-sm text-muted-foreground mb-1'>
                    Streak
                  </div>
                  <div className='text-2xl font-bold text-foreground'>0</div>
                  <div className='text-xs text-muted-foreground'>
                    🔥 Keep it going!
                  </div>
                </div>
                <Button
                  onClick={handleDailyCheckIn}
                  variant='outline'
                  size='sm'
                >
                  Check-in
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-card border-border'>
            <CardContent className='p-4'>
              <div>
                <div className='text-sm text-muted-foreground mb-1'>
                  Total XP
                </div>
                <div className='text-2xl font-bold text-foreground'>0</div>
                <div className='text-xs text-muted-foreground'>0 / ∞ XP</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Focus Section - Now Priority */}
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

        {/* Quests Section - Main Priority */}
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <span>Quests</span>
                {sortBy !== 'created_at' && (
                  <span className='text-sm text-neutral-400 font-normal'>
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
            <div className='divide-y divide-border bg-muted/30 border border-border overflow-hidden'>
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
                  <div className='text-lg font-medium mb-2'>
                    No quests found
                  </div>
                  <div className='text-sm'>
                    Try adjusting your search or filters, or add a new quest
                    above!
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar - Compact Stats */}
      <div className='w-80 flex-shrink-0 space-y-4'>
        {/* Badges - Compact */}
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
