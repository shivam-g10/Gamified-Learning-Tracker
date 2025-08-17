'use client';

import { useState } from 'react';
import { Target, BookOpen, GraduationCap } from 'lucide-react';
import type { Quest, Book, Course } from '@/lib/types';

interface TabbedContentProps {
  quests: Quest[];
  books: Book[];
  courses: Course[];
  questsContent: React.ReactNode;
  booksContent: React.ReactNode;
  coursesContent: React.ReactNode;
  activeTab?: 'quests' | 'books' | 'courses';
  onTabChange?: (tab: 'quests' | 'books' | 'courses') => void;
}

type TabType = 'quests' | 'books' | 'courses';

export function TabbedContent({
  quests,
  books,
  courses,
  questsContent,
  booksContent,
  coursesContent,
  activeTab: externalActiveTab,
  onTabChange,
}: TabbedContentProps) {
  const [internalActiveTab, setInternalActiveTab] = useState<TabType>('quests');

  // Use external control if provided, otherwise use internal state
  const activeTab = externalActiveTab || internalActiveTab;
  const setActiveTab = onTabChange || setInternalActiveTab;

  const tabs = [
    {
      id: 'quests' as const,
      label: 'Quests',
      icon: <Target className='w-4 h-4' />,
      count: quests.length,
      content: questsContent,
    },
    {
      id: 'books' as const,
      label: 'Books',
      icon: <BookOpen className='w-4 h-4' />,
      count: books.length,
      content: booksContent,
    },
    {
      id: 'courses' as const,
      label: 'Courses',
      icon: <GraduationCap className='w-4 h-4' />,
      count: courses.length,
      content: coursesContent,
    },
  ];

  return (
    <div className='space-y-4'>
      <div className='flex border-b border-border'>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 relative cursor-pointer ${
              activeTab === tab.id
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {tab.count}
            </span>
            {activeTab === tab.id && (
              <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary' />
            )}
          </button>
        ))}
      </div>

      <div className='min-h-[400px]'>
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}
