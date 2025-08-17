'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface SearchAndFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  filters: {
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  }[];
  showSearch?: boolean;
  showFilters?: boolean;
}

export function SearchAndFilters({
  search,
  onSearchChange,
  searchPlaceholder,
  filters,
  showSearch = true,
  showFilters = true,
}: SearchAndFiltersProps) {
  return (
    <div className='flex gap-3'>
      {showSearch && (
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            className='!pl-8 !pr-3'
          />
        </div>
      )}

      {showFilters &&
        filters.map(filter => (
          <Select
            key={filter.label}
            value={filter.value}
            onValueChange={filter.onChange}
          >
            <SelectTrigger className='w-40'>
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
    </div>
  );
}
