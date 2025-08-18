'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { SearchAndFilters } from './SearchAndFilters';
import { SearchService } from '@/services/search-service';
import type { Course } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface CoursesListProps {
  courses: Course[];
  search: string;
  statusFilter: string;
  platformFilter: string;
  categoryFilter: string;
  onAddCourse: () => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  onLogProgress: (course: Course) => void;
  onToggleFocus: (course: Course) => void;
  onViewHistory: (course: Course) => void;
  getIsInFocus: (courseId: string) => boolean;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onPlatformFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
}

export function CoursesList({
  courses,
  search,
  statusFilter,
  platformFilter,
  categoryFilter,
  onAddCourse,
  onEditCourse,
  onDeleteCourse,
  onLogProgress,
  onToggleFocus,
  onViewHistory,
  getIsInFocus,
  onSearchChange,
  onStatusFilterChange,
  onPlatformFilterChange,
  onCategoryFilterChange,
}: CoursesListProps) {
  // Apply search and filters using SearchService
  const filteredCourses = SearchService.searchCourses(courses, search, {
    status: statusFilter === 'all' ? undefined : statusFilter,
    platform: platformFilter === 'all' ? undefined : platformFilter,
    category: categoryFilter === 'all' ? undefined : categoryFilter,
  });

  // Get unique categories for filtering
  const uniqueCategories = Array.from(
    new Set(courses.map(course => course.category))
  ).sort();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'finished':
        return (
          <Badge variant='default' className='bg-green-600'>
            Finished
          </Badge>
        );
      case 'learning':
        return (
          <Badge
            variant='outline'
            className='border-purple-500 text-purple-500'
          >
            Learning
          </Badge>
        );
      case 'backlog':
        return <Badge variant='secondary'>Backlog</Badge>;
      default:
        return <Badge variant='outline'>{status}</Badge>;
    }
  };

  const getProgressPercentage = (course: Course) => {
    if (course.total_units === 0) return 0;
    return Math.min(
      100,
      Math.round((course.completed_units / course.total_units) * 100)
    );
  };

  const getProgressLabel = (course: Course) => {
    return `${course.completed_units}/${course.total_units} units`;
  };

  const getUniquePlatforms = () => {
    const platforms = courses
      .map(course => course.platform)
      .filter(Boolean) as string[];
    return [...new Set(platforms)];
  };

  const getDescriptionPreview = (description: string, max: number = 80) => {
    if (!description) return '';
    return description.length > max
      ? description.slice(0, max) + '...'
      : description;
  };

  return (
    <div className='space-y-4'>
      {/* Item Count */}
      <div className='flex items-center gap-2 mb-4'>
        <GraduationCap className='h-5 w-5 text-purple-500' />
        <Badge variant='outline'>{filteredCourses.length} courses</Badge>
      </div>

      {/* Search and Filters */}
      <SearchAndFilters
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder='Search courses by title, description, or platform...'
        filters={[
          {
            label: 'Status',
            value: statusFilter,
            options: [
              { value: 'all', label: 'All Status' },
              { value: 'backlog', label: 'Backlog' },
              { value: 'learning', label: 'Learning' },
              { value: 'finished', label: 'Finished' },
            ],
            onChange: onStatusFilterChange,
          },
          {
            label: 'Platform',
            value: platformFilter,
            options: [
              { value: 'all', label: 'All Platforms' },
              ...getUniquePlatforms().map(platform => ({
                value: platform,
                label: platform,
              })),
            ],
            onChange: onPlatformFilterChange,
          },
          {
            label: 'Category',
            value: categoryFilter,
            options: [
              { value: 'all', label: 'All Categories' },
              ...uniqueCategories.map(category => ({
                value: category,
                label: category,
              })),
            ],
            onChange: onCategoryFilterChange,
          },
        ]}
      />

      {/* Courses Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {filteredCourses.map(course => (
          <Card
            key={course.id}
            className='p-4 hover:shadow-md transition-shadow'
          >
            {/* Course Info */}
            <div className='mb-3'>
              <h3 className='font-medium text-sm line-clamp-2 mb-1'>
                {course.title}
              </h3>
              {course.platform && (
                <p className='text-xs text-muted-foreground mb-2'>
                  on {course.platform}
                </p>
              )}

              {/* Description preview + popup */}
              {course.description && (
                <div className='flex items-start justify-between gap-2 mb-2'>
                  <p className='text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1'>
                    {getDescriptionPreview(course.description, 80)}
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='p-1 h-5 w-5 hover:bg-muted/20 text-muted-foreground hover:text-foreground'
                        title='View description'
                      >
                        <Eye className='w-3 h-3' />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-[520px] w-full max-w-full'>
                      <DialogHeader>
                        <DialogTitle className='text-lg'>
                          {course.title}
                        </DialogTitle>
                        <DialogDescription className='text-sm text-muted-foreground'>
                          Course Details
                        </DialogDescription>
                      </DialogHeader>
                      <div className='space-y-4 w-full min-w-0'>
                        <div className='flex items-center gap-2 flex-wrap w-full min-w-0'>
                          <Badge
                            variant='outline'
                            className='text-xs border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20'
                          >
                            {course.category}
                          </Badge>
                          {getStatusBadge(course.status)}
                          {course.platform && (
                            <Badge variant='outline' className='text-xs'>
                              {course.platform}
                            </Badge>
                          )}
                        </div>
                        <div className='space-y-2 w-full min-w-0'>
                          <h4 className='font-medium text-sm text-foreground'>
                            Description
                          </h4>
                          <div className='p-3 bg-muted/20 rounded border border-muted-foreground/20 w-full min-w-0 overflow-hidden'>
                            <p className='text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed w-full min-w-0'>
                              {course.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              <div className='flex items-center gap-2 mb-2 flex-wrap'>
                {/* Category Badge */}
                <Badge
                  variant='outline'
                  className='text-xs border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20'
                >
                  {course.category}
                </Badge>
                {getStatusBadge(course.status)}
                {course.tags.length > 0 && (
                  <Badge variant='outline' className='text-xs'>
                    {course.tags[0]}
                    {course.tags.length > 1 && ` +${course.tags.length - 1}`}
                  </Badge>
                )}
                {/* Focus indicator */}
                {getIsInFocus(course.id) && (
                  <Badge
                    variant='outline'
                    className='text-xs border-primary/40 text-primary bg-primary/5'
                  >
                    🎯 Focused
                  </Badge>
                )}
              </div>
            </div>

            {/* Progress */}
            <div className='mb-4'>
              <div className='flex justify-between text-xs text-muted-foreground mb-1'>
                <span>Progress</span>
                <span>{getProgressPercentage(course)}%</span>
              </div>
              <Progress
                value={getProgressPercentage(course)}
                className='h-2 mb-1'
              />
              <div className='text-xs text-muted-foreground'>
                {getProgressLabel(course)}
              </div>
            </div>

            {/* Actions */}
            <div className='flex gap-2'>
              <Button
                size='sm'
                className='flex-1'
                onClick={() => onLogProgress(course)}
                disabled={course.status === 'finished'}
              >
                Log Progress
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onToggleFocus(course)}
                className={`transition-all duration-200 focus:ring-1 focus:ring-ring focus:ring-offset-2 ${
                  getIsInFocus(course.id)
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 shadow-sm'
                    : 'border-primary/20 text-primary hover:bg-primary/20 hover:border-primary/40 active:bg-primary/30 focus:bg-primary/20 hover:shadow-sm'
                }`}
              >
                {getIsInFocus(course.id) ? 'Unfocus' : 'Focus'}
              </Button>
            </div>

            {/* Edit/Delete */}
            <div className='flex gap-1 mt-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onViewHistory(course)}
                className='h-7 px-2 text-muted-foreground hover:text-foreground'
                title='View Progress History'
              >
                📊
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onEditCourse(course)}
                className='h-7 px-2 text-muted-foreground hover:text-foreground'
              >
                <Edit className='h-3 w-3' />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onDeleteCourse(course.id)}
                className='h-7 px-2 text-muted-foreground hover:text-destructive'
              >
                <Trash2 className='h-3 w-3' />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className='text-center py-12'>
          <GraduationCap className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
          <h3 className='text-lg font-medium text-muted-foreground mb-2'>
            {courses.length === 0
              ? 'No courses yet'
              : 'No courses match your search'}
          </h3>
          <p className='text-sm text-muted-foreground mb-4'>
            {courses.length === 0
              ? 'Start building your learning path by adding your first course.'
              : 'Try adjusting your search or filters.'}
          </p>
          {courses.length === 0 && (
            <Button onClick={onAddCourse}>
              <Plus className='h-4 w-4 mr-1' />
              Add Your First Course
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
