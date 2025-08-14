import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Search, ArrowUpDown } from 'lucide-react';

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
  filterType,
  filterCategory,
  sortBy,
  sortOrder,
  categories,
  onSearchChange,
  onFilterTypeChange,
  onFilterCategoryChange,
  onSortByChange,
  onSortOrderChange,
}: SearchAndFiltersProps) {
  return (
    <div className='space-y-4'>
      {/* Search Bar - Full Width with Enhanced Styling */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5' />
        <Input
          placeholder='Search quests by title or category...'
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className='pl-10'
        />
      </div>

      {/* Filter and Sort Controls - Enhanced Layout */}
      <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center'>
        {/* Filter Controls - Grouped with Labels */}
        <div className='flex flex-col sm:flex-row gap-3'>
          <div className='flex flex-col gap-1'>
            <Label className='text-xs text-neutral-400 uppercase tracking-wide'>
              Type
            </Label>
            <Select value={filterType} onValueChange={onFilterTypeChange}>
              <SelectTrigger className='min-w-[120px]'>
                <SelectValue placeholder='All Types' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=''>All Types</SelectItem>
                <SelectItem value='topic'>Topic</SelectItem>
                <SelectItem value='project'>Project</SelectItem>
                <SelectItem value='bonus'>Bonus</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='flex flex-col gap-1'>
            <Label className='text-xs text-neutral-400 uppercase tracking-wide'>
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
                <SelectItem value=''>All Categories</SelectItem>
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
        <div className='hidden sm:block w-px h-8 bg-gradient-to-b from-transparent via-neutral-600 to-transparent'></div>

        {/* Sort Controls - Enhanced with Better Visual Hierarchy */}
        <div className='flex flex-col sm:flex-row gap-3 items-start sm:items-center'>
          <div className='flex flex-col gap-1'>
            <Label className='text-xs text-neutral-400 uppercase tracking-wide'>
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
  );
}
