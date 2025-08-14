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
} from '../components/components/ui/card';
import {
  Overview,
  Badges,
  FocusChips,
  AddQuestForm,
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
    <div className='space-y-6'>
      <Overview
        totalXp={totalXp}
        streak={appState?.streak ?? 0}
        lastCheckIn={appState?.last_check_in ?? null}
        onRandomChallenge={handleRandomChallenge}
        onDailyCheckIn={handleDailyCheckIn}
      />

      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <Badges totalXp={totalXp} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Focus</CardTitle>
        </CardHeader>
        <CardContent>
          <FocusChips
            quests={quests || []}
            appState={appState || null}
            onToggleFocus={handleToggleFocus}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Quest</CardTitle>
        </CardHeader>
        <CardContent>
          <AddQuestForm onSubmit={handleAddQuest} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <span>Quests</span>
            {sortBy !== 'created_at' && (
              <span className='text-sm text-neutral-400 font-normal'>
                (sorted by {sortBy} {sortOrder === 'asc' ? '↑' : '↓'})
              </span>
            )}
          </CardTitle>
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
          <div className='divide-y divide-neutral-800/50 bg-neutral-900/20 rounded-lg border border-neutral-800/30 overflow-hidden'>
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
              <div className='text-center py-12 text-neutral-500'>
                <div className='text-4xl mb-3'>🎯</div>
                <div className='text-lg font-medium mb-2'>No quests found</div>
                <div className='text-sm'>
                  Try adjusting your search or filters, or add a new quest
                  above!
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryProgress quests={quests || []} />
        </CardContent>
      </Card>
    </div>
  );
}
