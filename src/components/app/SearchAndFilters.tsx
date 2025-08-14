import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Search, ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';

interface SearchAndFiltersProps {
  search: string;
  filterType: string;
  filterCategory: string;
  sortBy: 'title' | 'xp' | 'category' | 'type' | 'created_at' | 'done';
  sortOrder: 'asc' | 'desc';
  categories: string[];
  onSearchChange: (value: string) => void;
  onFilterTypeChange: (value: string) => void;
  onFilterCategoryChange: (value: string) => void;
  onSortByChange: (
    value: 'title' | 'xp' | 'category' | 'type' | 'created_at' | 'done'
  ) => void;
  onSortOrderChange: (value: 'asc' | 'desc') => void;
}

export function SearchAndFilters({
  search,
  filterType = 'all',
  filterCategory = 'all',
  sortBy = 'created_at',
  sortOrder = 'desc',
  categories,
  onSearchChange,
  onFilterTypeChange,
  onFilterCategoryChange,
  onSortByChange,
  onSortOrderChange,
}: SearchAndFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className='space-y-4'>
      {/* Search Bar - Full Width */}
      <div className='relative'>
        <Input
          name='search'
          placeholder='Search quests by title or category...'
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className='!pl-12 !pr-4'
        />
        <Search className='pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 opacity-50 select-none' />
      </div>

      {/* Collapsible Filters Toggle */}
      <div className='flex items-center justify-between'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setShowFilters(!showFilters)}
          className='text-muted-foreground hover:text-foreground'
        >
          {showFilters ? (
            <>
              <ChevronUp className='w-4 h-4 mr-1' />
              Hide filters
            </>
          ) : (
            <>
              <ChevronDown className='w-4 h-4 mr-1' />
              More filters ▸
            </>
          )}
        </Button>
      </div>

      {/* Filter and Sort Controls - Collapsible */}
      {showFilters && (
        <div className='space-y-4 pt-2 border-t border-border'>
          <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center'>
            {/* Filter Controls */}
            <div className='flex flex-col sm:flex-row gap-3'>
              <div className='flex flex-col gap-1'>
                <Label className='text-xs text-muted-foreground uppercase tracking-wide'>
                  Type
                </Label>
                <Select value={filterType} onValueChange={onFilterTypeChange}>
                  <SelectTrigger className='min-w-[120px]'>
                    <SelectValue placeholder='All Types' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Types</SelectItem>
                    <SelectItem value='topic'>Topic</SelectItem>
                    <SelectItem value='project'>Project</SelectItem>
                    <SelectItem value='bonus'>Bonus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='flex flex-col gap-1'>
                <Label className='text-xs text-muted-foreground uppercase tracking-wide'>
                  Category
                </Label>
                <Select
                  value={filterCategory}
                  onValueChange={onFilterCategoryChange}
                >
                  <SelectTrigger className='min-w-[140px]'>
                    <SelectValue placeholder='All Categories' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Categories</SelectItem>
                    {categories.map(c => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Visual Separator */}
            <div className='hidden sm:block w-px h-8 bg-border'></div>

            {/* Sort Controls */}
            <div className='flex flex-col sm:flex-row gap-3 items-start sm:items-center'>
              <div className='flex flex-col gap-1'>
                <Label className='text-xs text-muted-foreground uppercase tracking-wide'>
                  Sort by
                </Label>
                <div className='flex gap-2 items-center'>
                  <Select
                    value={sortBy}
                    onValueChange={value =>
                      onSortByChange(
                        value as
                          | 'title'
                          | 'xp'
                          | 'category'
                          | 'type'
                          | 'created_at'
                          | 'done'
                      )
                    }
                  >
                    <SelectTrigger className='min-w-[140px]'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='created_at'>Date Created</SelectItem>
                      <SelectItem value='title'>Title</SelectItem>
                      <SelectItem value='xp'>XP Value</SelectItem>
                      <SelectItem value='category'>Category</SelectItem>
                      <SelectItem value='type'>Type</SelectItem>
                      <SelectItem value='done'>Completion</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={() =>
                      onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')
                    }
                    variant='outline'
                    size='icon'
                    title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                  >
                    <ArrowUpDown className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
