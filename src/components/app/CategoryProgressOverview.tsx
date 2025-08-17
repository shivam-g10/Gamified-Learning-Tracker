import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export interface CategoryProgressData {
  category: string;
  percentage: number;
  totalItems: number;
  completedItems: number;
  quests: { total: number; completed: number };
  books: { total: number; completed: number };
  courses: { total: number; completed: number };
}

export interface CategoryProgressOverviewProps {
  questCategoryProgress: CategoryProgressData[];
  bookCategoryProgress: CategoryProgressData[];
  courseCategoryProgress: CategoryProgressData[];
}

/**
 * CategoryProgressOverview component displays progress statistics for all learning types
 * organized in collapsible accordion sections.
 */
export function CategoryProgressOverview({
  questCategoryProgress,
  bookCategoryProgress,
  courseCategoryProgress,
}: CategoryProgressOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Category Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {/* Quest Category Progress */}
          <Accordion type='single' collapsible className='w-full'>
            <AccordionItem
              value='quest-category-progress'
              className='border rounded-lg data-[state=open]:border-blue-400 data-[state=open]:shadow-[0_0_0_1px_rgba(59,130,246,0.4)] data-[state=open]:shadow-blue-500/20 transition-all duration-200'
            >
              <AccordionTrigger className='px-4 py-3 hover:no-underline data-[state=open]:text-blue-600'>
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-medium text-foreground'>
                    🎯 Quest Progress by Category
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    • Quest completion
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className='px-4 pb-4 pt-6'>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                  {questCategoryProgress.map(
                    ({ category, percentage, quests }) => (
                      <div
                        key={category}
                        className='text-center p-3 border rounded-lg bg-card hover:bg-muted/30 transition-colors'
                      >
                        <div className='text-sm font-medium text-foreground mb-2'>
                          {category}
                        </div>
                        <div className='text-2xl font-bold text-blue-600 mb-2'>
                          {percentage}%
                        </div>
                        <div className='w-full h-2 bg-muted rounded-full mb-2'>
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              percentage >= 100
                                ? 'bg-blue-500'
                                : percentage >= 75
                                  ? 'bg-blue-400'
                                  : percentage >= 50
                                    ? 'bg-blue-300'
                                    : percentage >= 25
                                      ? 'bg-blue-200'
                                      : 'bg-muted-foreground/30'
                            }`}
                            style={{
                              width: `${Math.max(percentage, 1)}%`,
                            }}
                          />
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          <div className='flex items-center justify-center gap-1'>
                            <span>🎯</span>
                            <span>
                              {quests.completed}/{quests.total} completed
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Book Category Progress */}
          <Accordion type='single' collapsible className='w-full'>
            <AccordionItem
              value='book-category-progress'
              className='border rounded-lg data-[state=open]:border-green-400 data-[state=open]:shadow-[0_0_0_1px_rgba(34,197,94,0.4)] data-[state=open]:shadow-green-500/20 transition-all duration-200'
            >
              <AccordionTrigger className='px-4 py-3 hover:no-underline data-[state=open]:text-green-600'>
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-medium text-foreground'>
                    📚 Book Progress by Category
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    • Reading completion
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className='px-4 pb-4 pt-6'>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                  {bookCategoryProgress.map(
                    ({ category, percentage, books }) => (
                      <div
                        key={category}
                        className='text-center p-3 border rounded-lg bg-card hover:bg-muted/30 transition-colors'
                      >
                        <div className='text-sm font-medium text-foreground mb-2'>
                          {category}
                        </div>
                        <div className='text-2xl font-bold text-green-600 mb-2'>
                          {percentage}%
                        </div>
                        <div className='w-full h-2 bg-muted rounded-full mb-2'>
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              percentage >= 100
                                ? 'bg-green-500'
                                : percentage >= 75
                                  ? 'bg-green-400'
                                  : percentage >= 50
                                    ? 'bg-green-300'
                                    : percentage >= 25
                                      ? 'bg-green-200'
                                      : 'bg-muted-foreground/30'
                            }`}
                            style={{
                              width: `${Math.max(percentage, 1)}%`,
                            }}
                          />
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          <div className='flex items-center justify-center gap-1'>
                            <span>📚</span>
                            <span>
                              {books.completed}/{books.total} finished
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Course Category Progress */}
          <Accordion type='single' collapsible className='w-full'>
            <AccordionItem
              value='course-category-progress'
              className='border rounded-lg data-[state=open]:border-purple-400 data-[state=open]:shadow-[0_0_0_1px_rgba(168,85,247,0.4)] data-[state=open]:shadow-purple-500/20 transition-all duration-200'
            >
              <AccordionTrigger className='px-4 py-3 hover:no-underline data-[state=open]:text-purple-600'>
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-medium text-foreground'>
                    🎓 Course Progress by Category
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    • Learning completion
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className='px-4 pb-4 pt-6'>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                  {courseCategoryProgress.map(
                    ({ category, percentage, courses }) => (
                      <div
                        key={category}
                        className='text-center p-3 border rounded-lg bg-card hover:bg-muted/30 transition-colors'
                      >
                        <div className='text-sm font-medium text-foreground mb-2'>
                          {category}
                        </div>
                        <div className='text-2xl font-bold text-purple-600 mb-2'>
                          {percentage}%
                        </div>
                        <div className='w-full h-2 bg-muted rounded-full mb-2'>
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              percentage >= 100
                                ? 'bg-purple-500'
                                : percentage >= 75
                                  ? 'bg-purple-400'
                                  : percentage >= 50
                                    ? 'bg-purple-300'
                                    : percentage >= 25
                                      ? 'bg-purple-200'
                                      : 'bg-muted-foreground/30'
                            }`}
                            style={{
                              width: `${Math.max(percentage, 1)}%`,
                            }}
                          />
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          <div className='flex items-center justify-center gap-1'>
                            <span>🎓</span>
                            <span>
                              {courses.completed}/{courses.total} finished
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}
