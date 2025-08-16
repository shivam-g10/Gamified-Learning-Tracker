'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Quest,
  Book,
  Course,
  FocusState,
  CreateBookData,
  UpdateBookData,
  CreateCourseData,
  UpdateCourseData,
} from '../lib/types';
import {
  useQuests,
  useAppState,
  useBooks,
  useCourses,
  useFocusState,
} from '../lib/hooks';
import {
  QuestService,
  AppStateService,
  CreateQuestData,
  CategoryBadgeService,
  ChallengeService,
  SearchService,
  XPService,
} from '../services';
import { ChallengeItem } from '../services/challenge-service';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { Flame, Sparkles, ChevronDown, Dices, Target } from 'lucide-react';
import { toast } from 'sonner';
import {
  AddQuestDialog,
  AddOrEditBookDialog,
  AddOrEditCourseDialog,
  AddQuestForm,
  Badges,
  CategoryProgress,
  ChallengeModal,
  FocusChips,
  LevelCard,
  Overview,
  QuestRow,
  SearchAndFilters,
  StreakCard,
  TotalXPCard,
  FocusRow,
  BooksList,
  CoursesList,
  TabbedContent,
  LogBookProgressDialog,
  LogCourseProgressDialog,
  BookProgressHistory,
  CourseProgressHistory,
} from '../components/app';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const { quests, mutateQuests } = useQuests();
  const { appState, mutateState } = useAppState();
  const { books, mutateBooks } = useBooks();
  const { courses, mutateCourses } = useCourses();
  const { focusState, mutateFocusState } = useFocusState();

  // State management for search, filters, and sorting
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState<
    'title' | 'xp' | 'category' | 'type' | 'created_at' | 'done'
  >('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [previousTotalXp, setPreviousTotalXp] = useState(0);

  // Search and filter state for books and courses
  const [bookSearch, setBookSearch] = useState('');
  const [bookStatusFilter, setBookStatusFilter] = useState('all');
  const [bookCategoryFilter, setBookCategoryFilter] = useState('all');
  const [courseSearch, setCourseSearch] = useState('');
  const [courseStatusFilter, setCourseStatusFilter] = useState('all');
  const [coursePlatformFilter, setCoursePlatformFilter] = useState('all');
  const [courseCategoryFilter, setCourseCategoryFilter] = useState('all');

  // Challenge modal state
  const [challengeItem, setChallengeItem] = useState<ChallengeItem | null>(
    null
  );
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);

  // Dialog state for books and courses
  const [isAddBookDialogOpen, setIsAddBookDialogOpen] = useState(false);
  const [isAddCourseDialogOpen, setIsAddCourseDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Tab navigation state
  const [activeTab, setActiveTab] = useState<'quests' | 'books' | 'courses'>(
    'quests'
  );

  // Progress logging dialog state
  const [isLogBookProgressOpen, setIsLogBookProgressOpen] = useState(false);
  const [isLogCourseProgressOpen, setIsLogCourseProgressOpen] = useState(false);
  const [loggingBook, setLoggingBook] = useState<Book | null>(null);
  const [loggingCourse, setLoggingCourse] = useState<Course | null>(null);

  // Progress history dialog state
  const [isBookHistoryOpen, setIsBookHistoryOpen] = useState(false);
  const [isCourseHistoryOpen, setIsCourseHistoryOpen] = useState(false);
  const [viewingBook, setViewingBook] = useState<Book | null>(null);
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);

  // Calculated values using services
  const totalXp = useMemo(
    () => XPService.calculateTotalXP(quests, books, courses),
    [quests, books, courses]
  );

  // Get XP breakdown by source
  const xpBreakdown = useMemo(
    () => XPService.getXPBreakdown(quests, books, courses),
    [quests, books, courses]
  );

  // Get unique categories from all learning items
  const categories = useMemo(() => {
    return CategoryBadgeService.getUniqueCategories(quests, books, courses);
  }, [quests, books, courses]);

  const filtered = useMemo(() => {
    const filteredQuests = SearchService.searchQuests(quests, search, {
      type: filterType,
      category: filterCategory,
    });

    return QuestService.sortQuests(filteredQuests, sortBy, sortOrder);
  }, [quests, search, filterType, filterCategory, sortBy, sortOrder]);

  // Track XP changes for animations
  useEffect(() => {
    if (totalXp !== previousTotalXp) {
      setPreviousTotalXp(totalXp);
    }
  }, [totalXp, previousTotalXp]);

  // Calculate level info using service
  const levelInfo = useMemo(() => {
    const level = Math.floor(totalXp / 150) + 1;
    const progress = totalXp % 150;
    const nextLevelXp = 150;
    const pct = Math.round((progress / nextLevelXp) * 100);
    return { level, progress, nextLevelXp, pct };
  }, [totalXp]);

  // Calculate badge thresholds using service
  const badgeThresholds = useMemo(() => {
    const thresholds = [150, 400, 800, 1200, 2000];
    return thresholds.map(threshold => ({
      threshold,
      name:
        threshold === 150
          ? 'Bronze'
          : threshold === 400
            ? 'Silver'
            : threshold === 800
              ? 'Gold'
              : threshold === 1200
                ? 'Epic'
                : 'Legendary',
      earned: totalXp >= threshold,
      color:
        threshold === 150
          ? 'bg-amber-600'
          : threshold === 400
            ? 'bg-gray-500'
            : threshold === 800
              ? 'bg-yellow-500'
              : threshold === 1200
                ? 'bg-purple-600'
                : 'bg-orange-600',
    }));
  }, [totalXp]);

  // Calculate category progress and badges using service
  const questCategoryProgress = useMemo(() => {
    return CategoryBadgeService.getCategoryProgressByType(quests, 'quests');
  }, [quests]);

  const bookCategoryProgress = useMemo(() => {
    return CategoryBadgeService.getCategoryProgressByType(books, 'books');
  }, [books]);

  const courseCategoryProgress = useMemo(() => {
    return CategoryBadgeService.getCategoryProgressByType(courses, 'courses');
  }, [courses]);

  // Event handlers using services
  const handleAddQuest = useCallback(
    async (data: CreateQuestData) => {
      try {
        await QuestService.createQuest(data);
        await mutateQuests();
        toast.success('Quest added successfully!');
      } catch (error) {
        console.error('Failed to add quest:', error);
        toast.error('Failed to add quest. Please try again.');
      }
    },
    [mutateQuests]
  );

  const handleToggleDone = useCallback(
    async (quest: Quest) => {
      try {
        await QuestService.toggleQuestCompletion(quest.id, quest.done);
        await mutateQuests();
        if (!quest.done) {
          toast.success(`Quest completed! +${quest.xp} XP earned.`);
        }
      } catch (error) {
        console.error('Failed to toggle quest completion:', error);
        toast.error('Failed to update quest. Please try again.');
      }
    },
    [mutateQuests]
  );

  const handleDeleteQuest = useCallback(
    async (quest: Quest) => {
      try {
        await QuestService.deleteQuest(quest.id);
        await mutateQuests();
        toast.success('Quest deleted successfully!');
      } catch (error) {
        console.error('Failed to delete quest:', error);
        toast.error('Failed to delete quest. Please try again.');
      }
    },
    [mutateQuests]
  );

  // New handlers for Books and Courses
  const handleAddBook = useCallback(() => {
    setEditingBook(null);
    setIsAddBookDialogOpen(true);
  }, []);

  const handleEditBook = useCallback((book: Book) => {
    setEditingBook(book);
    setIsAddBookDialogOpen(true);
  }, []);

  const handleBookSubmit = useCallback(
    async (data: CreateBookData | UpdateBookData) => {
      try {
        if (editingBook) {
          // Update existing book
          const response = await fetch(`/api/books/${editingBook.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            await mutateBooks();
            toast.success('Book updated successfully!');
            setIsAddBookDialogOpen(false);
            setEditingBook(null);
          } else {
            throw new Error('Failed to update book');
          }
        } else {
          // Create new book
          const response = await fetch('/api/books', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            await mutateBooks();
            toast.success('Book added successfully!');
            setIsAddBookDialogOpen(false);
          } else {
            throw new Error('Failed to add book');
          }
        }
      } catch (error) {
        console.error('Failed to save book:', error);
        toast.error('Failed to save book. Please try again.');
      }
    },
    [editingBook, mutateBooks]
  );

  const handleDeleteBook = useCallback(
    async (bookId: string) => {
      try {
        const response = await fetch(`/api/books/${bookId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await mutateBooks();
          toast.success('Book deleted successfully!');
        } else {
          throw new Error('Failed to delete book');
        }
      } catch (error) {
        console.error('Failed to delete book:', error);
        toast.error('Failed to delete book. Please try again.');
      }
    },
    [mutateBooks]
  );

  const handleLogBookProgress = useCallback(async (book: Book) => {
    setLoggingBook(book);
    setIsLogBookProgressOpen(true);
  }, []);

  const handleBookProgressSubmit = useCallback(
    async (data: { from_page: number; to_page: number; notes?: string }) => {
      if (!loggingBook) return;

      try {
        const response = await fetch(`/api/books/${loggingBook.id}/log`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const result = await response.json();
          await mutateBooks();
          await mutateFocusState();

          // Show success message with XP details
          let message = `Progress logged! +${result.xpEarned} XP earned`;
          if (result.focusBoostXP > 0) {
            message += ` (includes +${result.focusBoostXP} focus boost)`;
          }
          if (result.finishBonus > 0) {
            message += ` (includes +${result.finishBonus} finish bonus)`;
          }
          if (result.isFinished) {
            message += ' 🎉 Book completed!';
          }

          toast.success(message);
          setIsLogBookProgressOpen(false);
          setLoggingBook(null);
        } else {
          throw new Error('Failed to log progress');
        }
      } catch (error) {
        console.error('Failed to log book progress:', error);
        toast.error('Failed to log progress. Please try again.');
      }
    },
    [loggingBook, mutateBooks, mutateFocusState]
  );

  const handleAddCourse = useCallback(() => {
    setEditingCourse(null);
    setIsAddCourseDialogOpen(true);
  }, []);

  const handleEditCourse = useCallback((course: Course) => {
    setEditingCourse(course);
    setIsAddCourseDialogOpen(true);
  }, []);

  const handleCourseSubmit = useCallback(
    async (data: CreateCourseData | UpdateCourseData) => {
      try {
        if (editingCourse) {
          // Update existing course
          const response = await fetch(`/api/courses/${editingCourse.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            await mutateCourses();
            toast.success('Course updated successfully!');
            setIsAddCourseDialogOpen(false);
            setEditingCourse(null);
          } else {
            throw new Error('Failed to update course');
          }
        } else {
          // Create new course
          const response = await fetch('/api/courses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            await mutateCourses();
            toast.success('Course added successfully!');
            setIsAddCourseDialogOpen(false);
          } else {
            throw new Error('Failed to add course');
          }
        }
      } catch (error) {
        console.error('Failed to save course:', error);
        toast.error('Failed to save course. Please try again.');
      }
    },
    [editingCourse, mutateCourses]
  );

  const handleDeleteCourse = useCallback(
    async (courseId: string) => {
      try {
        const response = await fetch(`/api/courses/${courseId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await mutateCourses();
          toast.success('Course deleted successfully!');
        } else {
          throw new Error('Failed to delete course');
        }
      } catch (error) {
        console.error('Failed to delete course:', error);
        toast.error('Failed to delete course. Please try again.');
      }
    },
    [mutateCourses]
  );

  const handleLogCourseProgress = useCallback(async (course: Course) => {
    setLoggingCourse(course);
    setIsLogCourseProgressOpen(true);
  }, []);

  const handleCourseProgressSubmit = useCallback(
    async (data: { units_delta: number; notes?: string }) => {
      if (!loggingCourse) return;

      try {
        const response = await fetch(`/api/courses/${loggingCourse.id}/log`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const result = await response.json();
          await mutateCourses();
          await mutateFocusState();

          // Show success message with XP details
          let message = `Progress logged! +${result.xpEarned} XP earned`;
          if (result.focusBoostXP > 0) {
            message += ` (includes +${result.focusBoostXP} focus boost)`;
          }
          if (result.finishBonus > 0) {
            message += ` (includes +${result.finishBonus} finish bonus)`;
          }
          if (result.isFinished) {
            message += ' 🎉 Course completed!';
          }

          toast.success(message);
          setIsLogCourseProgressOpen(false);
          setLoggingCourse(null);
        } else {
          throw new Error('Failed to log progress');
        }
      } catch (error) {
        console.error('Failed to log course progress:', error);
        toast.error('Failed to log progress. Please try again.');
      }
    },
    [loggingCourse, mutateCourses, mutateFocusState]
  );

  // Progress history handlers
  const handleViewBookHistory = useCallback((book: Book) => {
    setViewingBook(book);
    setIsBookHistoryOpen(true);
  }, []);

  const handleViewCourseHistory = useCallback((course: Course) => {
    setViewingCourse(course);
    setIsCourseHistoryOpen(true);
  }, []);

  // Focus management handlers
  const handleUpdateFocus = useCallback(
    async (type: 'quest' | 'book' | 'course', id: string | null) => {
      try {
        const response = await fetch('/api/focus', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type,
            id,
            action: id === null ? 'remove' : 'switch',
          }),
        });

        if (response.ok) {
          await mutateFocusState();
          toast.success(`${type} focus updated successfully!`);
        } else {
          throw new Error('Failed to update focus');
        }
      } catch (error) {
        console.error('Failed to update focus:', error);
        toast.error('Failed to update focus. Please try again.');
      }
    },
    [mutateFocusState]
  );

  const handleToggleQuestFocus = useCallback(
    async (quest: Quest) => {
      try {
        const isCurrentlyFocused = focusState?.quest?.id === quest.id;
        const action = isCurrentlyFocused ? 'remove' : 'switch';

        const response = await fetch('/api/focus', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'quest',
            id: isCurrentlyFocused ? null : quest.id,
            action,
          }),
        });

        if (response.ok) {
          await mutateFocusState();
          toast.success(
            isCurrentlyFocused
              ? 'Quest removed from focus'
              : 'Quest added to focus!'
          );
        } else {
          throw new Error('Failed to update focus');
        }
      } catch (error) {
        console.error('Failed to toggle quest focus:', error);
        toast.error('Failed to update focus. Please try again.');
      }
    },
    [focusState, mutateFocusState]
  );

  const handleToggleBookFocus = useCallback(
    async (book: Book) => {
      try {
        const isCurrentlyFocused = focusState?.book?.id === book.id;
        const action = isCurrentlyFocused ? 'remove' : 'switch';

        const response = await fetch('/api/focus', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'book',
            id: isCurrentlyFocused ? null : book.id,
            action,
          }),
        });

        if (response.ok) {
          await mutateFocusState();
          toast.success(
            isCurrentlyFocused
              ? 'Book removed from focus'
              : 'Book added to focus!'
          );
        } else {
          throw new Error('Failed to update focus');
        }
      } catch (error) {
        console.error('Failed to toggle book focus:', error);
        toast.error('Failed to update focus. Please try again.');
      }
    },
    [focusState, mutateFocusState]
  );

  const handleToggleCourseFocus = useCallback(
    async (course: Course) => {
      try {
        const isCurrentlyFocused = focusState?.course?.id === course.id;
        const action = isCurrentlyFocused ? 'remove' : 'switch';

        const response = await fetch('/api/focus', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'course',
            id: isCurrentlyFocused ? null : course.id,
            action,
          }),
        });

        if (response.ok) {
          await mutateFocusState();
          toast.success(
            isCurrentlyFocused
              ? 'Course removed from focus'
              : 'Course added to focus!'
          );
        } else {
          throw new Error('Failed to update focus');
        }
      } catch (error) {
        console.error('Failed to toggle course focus:', error);
        toast.error('Failed to update focus. Please try again.');
      }
    },
    [focusState, mutateFocusState]
  );

  const handleDailyCheckIn = useCallback(async () => {
    try {
      await AppStateService.recordDailyCheckIn();
      await mutateState();
      toast.success('🔥 Streak +1 — see you tomorrow!');
    } catch (error) {
      console.error('Failed to record daily check-in:', error);
      toast.error('Failed to record check-in. Please try again.');
    }
  }, [mutateState]);

  const handleRandomChallenge = useCallback(async () => {
    try {
      const challenge = await ChallengeService.getRandomChallenge();
      if (!challenge) {
        toast.info('All learning items are completed — nice!');
        return;
      }

      // Check focus limit based on challenge type
      let canAdd = false;
      let errorMessage = '';

      switch (challenge.type) {
        case 'quest':
          canAdd = ChallengeService.canAddQuestToFocus(focusState);
          errorMessage = ChallengeService.getQuestFocusLimitMessage();
          break;
        case 'book':
          canAdd = ChallengeService.canAddBookToFocus(focusState);
          errorMessage = ChallengeService.getBookFocusLimitMessage();
          break;
        case 'course':
          canAdd = ChallengeService.canAddCourseToFocus(focusState);
          errorMessage = ChallengeService.getCourseFocusLimitMessage();
          break;
        default:
          canAdd = true; // Unknown type, allow it
      }

      if (!canAdd) {
        toast.error(errorMessage);
        return;
      }

      setChallengeItem(challenge);
      setIsChallengeModalOpen(true);
    } catch (error) {
      console.error('Failed to get random challenge:', error);
      toast.error('Failed to get random challenge. Please try again.');
    }
  }, [focusState]);

  const handleChallengeAccept = useCallback(
    async (challenge: ChallengeItem) => {
      try {
        // Add the challenge to focus based on its type
        await handleUpdateFocus(
          challenge.type as 'quest' | 'book' | 'course',
          challenge.id
        );

        // Show success message with challenge type
        const typeDisplay = ChallengeService.getChallengeTypeDisplayName(
          challenge.type
        );
        toast.success(`${typeDisplay} "${challenge.title}" added to focus!`);
      } catch (error) {
        console.error('Failed to add challenge to focus:', error);
        toast.error('Failed to add challenge to focus. Please try again.');
      }
    },
    [handleUpdateFocus]
  );

  return (
    <>
      <div className='space-y-6'>
        {/* Original Overview Section - Restored */}
        <Card>
          <CardHeader className='pb-4'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-lg'>Learning Progress</CardTitle>
              <div className='flex items-center gap-2'>
                {/* Streak Display */}
                <div className='flex items-center gap-2 px-3 py-1 bg-muted/30 rounded-lg'>
                  <Flame className='w-4 h-4 text-secondary' />
                  <span className='text-sm font-medium text-foreground'>
                    {appState?.streak || 0}
                  </span>
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleDailyCheckIn}
                        variant='outline'
                        size='sm'
                        className={`transition-all duration-200 focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                          appState?.last_check_in &&
                          new Date(appState.last_check_in).toDateString() ===
                            new Date().toDateString()
                            ? 'bg-green-600 text-white border-green-600 hover:bg-green-700'
                            : 'hover:bg-muted/50 hover:border-muted-foreground/50'
                        }`}
                      >
                        Check-in
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {appState?.last_check_in &&
                      new Date(appState.last_check_in).toDateString() ===
                        new Date().toDateString()
                        ? 'Already checked in today!'
                        : 'Record your daily progress'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Random Challenge Button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleRandomChallenge}
                        variant='outline'
                        size='sm'
                        className='transition-all duration-200 focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-muted/50 hover:border-muted-foreground/50'
                      >
                        <Dices className='w-4 h-4 mr-1' />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Get a random quest, book, or course challenge
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardHeader>

          <CardContent className='space-y-4'>
            {/* Level and XP Display */}
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-2xl font-bold text-foreground'>
                  Level {levelInfo.level}
                </h2>
                <p className='text-muted-foreground'>
                  {levelInfo.progress}/{levelInfo.nextLevelXp} XP to next level
                </p>
              </div>
              <div className='text-right'>
                <div className='text-3xl font-bold text-foreground'>
                  {totalXp}
                </div>
                <div className='text-sm text-muted-foreground'>Total XP</div>
                {/* XP Breakdown */}
                <div className='text-xs text-muted-foreground/70 mt-1 space-y-0.5'>
                  <div>🎯 {xpBreakdown.quests} XP</div>
                  <div>📚 {xpBreakdown.books} XP</div>
                  <div>🎓 {xpBreakdown.courses} XP</div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className='mb-4'>
              <Progress
                value={levelInfo.pct}
                className='h-3 progress-shimmer'
              />
            </div>

            {/* Badges Section - Small and Thin */}
            <div className='pt-2 border-t border-border'>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-sm font-medium text-muted-foreground'>
                  Badges
                </span>
                <span className='text-xs text-muted-foreground'>
                  {badgeThresholds.filter(b => b.earned).length}/
                  {badgeThresholds.length} earned
                </span>
              </div>
              <div className='flex flex-wrap gap-2'>
                {badgeThresholds.map(({ threshold, name, earned, color }) => (
                  <div
                    key={threshold}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md border text-xs ${
                      earned
                        ? `${color} text-white border-transparent`
                        : 'bg-muted/30 border-muted text-muted-foreground'
                    }`}
                  >
                    <span className='font-medium'>{name}</span>
                    {earned && <Sparkles className='w-3 h-3 text-white' />}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Focus Row for 1+1+1 System */}
        <FocusRow
          focusState={focusState || {}}
          quests={quests}
          books={books}
          courses={courses}
          onUpdateFocus={handleUpdateFocus}
          onNavigateToTab={setActiveTab}
          onToggleQuestDone={handleToggleDone}
          onUpdateBookProgress={handleLogBookProgress}
          onUpdateCourseProgress={handleLogCourseProgress}
        />

        {/* Main Content with Tabs */}
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-lg'>Learning Items</CardTitle>
              {/* Add Quest button only shows in Quests tab - will be handled by TabbedContent */}
            </div>
          </CardHeader>
          <CardContent>
            <TabbedContent
              quests={quests}
              books={books}
              courses={courses}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              questsContent={
                <>
                  <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-lg font-medium'>Quests</h3>
                    <AddQuestDialog onSubmit={handleAddQuest} />
                  </div>

                  {/* Quest Category Progress */}
                  <Accordion type='single' collapsible className='w-full mb-6'>
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
                                      {quests.completed}/{quests.total}{' '}
                                      completed
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

                  {/* Quest Count */}
                  <div className='flex items-center gap-2 mb-4'>
                    <Target className='w-5 h-5 text-blue-500' />
                    <Badge variant='outline'>
                      {typeof filtered !== 'undefined'
                        ? filtered.length
                        : quests.length}{' '}
                      quests
                    </Badge>
                  </div>

                  <SearchAndFilters
                    search={search}
                    onSearchChange={setSearch}
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
                        onChange: setFilterType,
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
                        onChange: setFilterCategory,
                      },
                    ]}
                  />

                  {/* Quest List */}
                  <div className='divide-y divide-border bg-muted/30 border border-border overflow-hidden rounded-lg'>
                    {filtered?.map((q: Quest) => (
                      <QuestRow
                        key={q.id}
                        quest={q}
                        isInFocus={focusState?.quest?.id === q.id}
                        onToggleDone={handleToggleDone}
                        onToggleFocus={handleToggleQuestFocus}
                        onDelete={handleDeleteQuest}
                      />
                    ))}
                    {filtered && filtered.length === 0 && (
                      <div className='text-center py-12 text-muted-foreground'>
                        <div className='text-4xl mb-3'>🎯</div>
                        <div className='text-lg font-medium mb-2'>
                          No quests yet
                        </div>
                        <div className='text-sm'>
                          Add your first quest to start earning XP
                        </div>
                      </div>
                    )}
                  </div>
                </>
              }
              booksContent={
                <>
                  <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-lg font-medium'>Books</h3>
                    <Button onClick={handleAddBook} variant='outline' size='sm'>
                      + Add Book
                    </Button>
                  </div>

                  {/* Book Category Progress */}
                  <Accordion type='single' collapsible className='w-full mb-6'>
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

                  <BooksList
                    books={books}
                    search={bookSearch}
                    statusFilter={bookStatusFilter}
                    categoryFilter={bookCategoryFilter}
                    onAddBook={handleAddBook}
                    onEditBook={handleEditBook}
                    onDeleteBook={handleDeleteBook}
                    onLogProgress={handleLogBookProgress}
                    onToggleFocus={handleToggleBookFocus}
                    getIsInFocus={bookId => focusState?.book?.id === bookId}
                    onSearchChange={setBookSearch}
                    onStatusFilterChange={setBookStatusFilter}
                    onCategoryFilterChange={setBookCategoryFilter}
                    onViewHistory={handleViewBookHistory}
                  />
                </>
              }
              coursesContent={
                <>
                  <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-lg font-medium'>Courses</h3>
                    <Button
                      onClick={handleAddCourse}
                      variant='outline'
                      size='sm'
                    >
                      + Add Course
                    </Button>
                  </div>

                  {/* Course Category Progress */}
                  <Accordion type='single' collapsible className='w-full mb-6'>
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
                                      {courses.completed}/{courses.total}{' '}
                                      finished
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

                  <CoursesList
                    courses={courses}
                    search={courseSearch}
                    statusFilter={courseStatusFilter}
                    categoryFilter={courseCategoryFilter}
                    platformFilter={coursePlatformFilter}
                    onAddCourse={handleAddCourse}
                    onEditCourse={handleEditCourse}
                    onDeleteCourse={handleDeleteCourse}
                    onLogProgress={handleLogCourseProgress}
                    onToggleFocus={handleToggleCourseFocus}
                    getIsInFocus={courseId =>
                      focusState?.course?.id === courseId
                    }
                    onSearchChange={setCourseSearch}
                    onStatusFilterChange={setCourseStatusFilter}
                    onCategoryFilterChange={setCourseCategoryFilter}
                    onPlatformFilterChange={setCoursePlatformFilter}
                    onViewHistory={handleViewCourseHistory}
                  />
                </>
              }
            />
          </CardContent>
        </Card>
      </div>

      {/* Challenge Modal */}
      <ChallengeModal
        challenge={challengeItem}
        isOpen={isChallengeModalOpen}
        onClose={() => {
          setIsChallengeModalOpen(false);
          setChallengeItem(null);
        }}
        onAccept={handleChallengeAccept}
      />

      {/* Book Dialog */}
      <AddOrEditBookDialog
        book={editingBook}
        onSubmit={handleBookSubmit}
        open={isAddBookDialogOpen}
        onOpenChange={setIsAddBookDialogOpen}
      />

      {/* Course Dialog */}
      <AddOrEditCourseDialog
        course={editingCourse}
        onSubmit={handleCourseSubmit}
        open={isAddCourseDialogOpen}
        onOpenChange={setIsAddCourseDialogOpen}
      />

      {/* Book Progress Logging Dialog */}
      {loggingBook && (
        <LogBookProgressDialog
          book={loggingBook}
          isOpen={isLogBookProgressOpen}
          onClose={() => {
            setIsLogBookProgressOpen(false);
            setLoggingBook(null);
          }}
          onSubmit={handleBookProgressSubmit}
        />
      )}

      {/* Course Progress Logging Dialog */}
      {loggingCourse && (
        <LogCourseProgressDialog
          course={loggingCourse}
          isOpen={isLogCourseProgressOpen}
          onClose={() => {
            setIsLogCourseProgressOpen(false);
            setLoggingCourse(null);
          }}
          onSubmit={handleCourseProgressSubmit}
        />
      )}

      {/* Book Progress History Dialog */}
      {viewingBook && (
        <BookProgressHistory
          book={viewingBook}
          isOpen={isBookHistoryOpen}
          onClose={() => {
            setIsBookHistoryOpen(false);
            setViewingBook(null);
          }}
        />
      )}

      {/* Course Progress History Dialog */}
      {viewingCourse && (
        <CourseProgressHistory
          course={viewingCourse}
          isOpen={isCourseHistoryOpen}
          onClose={() => {
            setIsCourseHistoryOpen(false);
            setViewingCourse(null);
          }}
        />
      )}
    </>
  );
}
