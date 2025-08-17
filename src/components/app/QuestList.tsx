import React from 'react';
import { Quest } from '@/lib/types';
import { QuestRow } from './QuestRow';
import { SearchAndFilters } from './SearchAndFilters';
import { Badge } from '@/components/ui/badge';
import { Target } from 'lucide-react';

export interface QuestListProps {
  quests: Quest[] | undefined;
  filteredQuests: Quest[] | undefined;
  search: string;
  filterType: string;
  filterCategory: string;
  categories: string[];
  onSearchChange: (search: string) => void;
  onFilterTypeChange: (type: string) => void;
  onFilterCategoryChange: (category: string) => void;
  onToggleDone: (quest: Quest) => void;
  onToggleFocus: (quest: Quest) => void;
  onDelete: (quest: Quest) => void;
  getIsInFocus: (questId: string) => boolean;
}

/**
 * QuestList component displays a list of quests with search, filtering, and actions.
 * Follows the same pattern as BooksList and CoursesList for consistency.
 */
export function QuestList({
  quests,
  filteredQuests,
  search,
  filterType,
  filterCategory,
  categories,
  onSearchChange,
  onFilterTypeChange,
  onFilterCategoryChange,
  onToggleDone,
  onToggleFocus,
  onDelete,
  getIsInFocus,
}: QuestListProps) {
  return (
    <div className='space-y-4'>
      {/* Quest Count */}
      <div className='flex items-center gap-2 mb-4'>
        <Target className='w-5 h-5 text-blue-500' />
        <Badge variant='outline'>
          {filteredQuests?.length ?? quests?.length ?? 0} quests
        </Badge>
      </div>

      {/* Search and Filters */}
      <SearchAndFilters
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder='Search quests by title or category...'
        filters={[
          {
            label: 'Type',
            value: filterType,
            options: [
              { value: 'all', label: 'All Types' },
              { value: 'topic', label: 'Topic' },
              { value: 'project', label: 'Project' },
              { value: 'bonus', label: 'Bonus' },
            ],
            onChange: onFilterTypeChange,
          },
          {
            label: 'Category',
            value: filterCategory,
            options: [
              { value: 'all', label: 'All Categories' },
              ...categories.map(category => ({
                value: category,
                label: category,
              })),
            ],
            onChange: onFilterCategoryChange,
          },
        ]}
      />

      {/* Quest List */}
      <div className='divide-y divide-border bg-muted/30 border border-border overflow-hidden rounded-lg'>
        {filteredQuests?.map((quest: Quest) => (
          <QuestRow
            key={quest.id}
            quest={quest}
            isInFocus={getIsInFocus(quest.id)}
            onToggleDone={onToggleDone}
            onToggleFocus={onToggleFocus}
            onDelete={onDelete}
          />
        ))}
        {filteredQuests && filteredQuests.length === 0 && (
          <div className='text-center py-12 text-muted-foreground'>
            <div className='text-4xl mb-3'>🎯</div>
            <div className='text-lg font-medium mb-2'>No quests found</div>
            <div className='text-sm'>
              {search || filterType !== 'all' || filterCategory !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Add your first quest to start earning XP'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
