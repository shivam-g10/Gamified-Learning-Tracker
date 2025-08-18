'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Quest,
  Book,
  Course,
  CreateBookData,
  UpdateBookData,
  CreateCourseData,
  UpdateCourseData,
} from '../../lib/types';
import {
  useQuests,
  useAppState,
  useBooks,
  useCourses,
  useFocusState,
} from '../../lib/hooks';
import {
  CategoryBadgeService,
  ChallengeService,
  SearchService,
  XPService,
  BookManagementService,
  CourseManagementService,
  FocusService,
  QuestService,
  AppStateService,
} from '../../services';

import type { ChallengeItem, CreateQuestData } from '../../lib/client-types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../components/ui/accordion';
import { toast } from 'sonner';
import {
  AddQuestDialog,
  AddOrEditBookDialog,
  AddOrEditCourseDialog,
  ProgressOverview,
  ChallengeModal,
  FocusRow,
  QuestList,
  BooksList,
  CoursesList,
  TabbedContent,
  LogBookProgressDialog,
  LogCourseProgressDialog,
  BookProgressHistory,
  CourseProgressHistory,
  BulkSetupDialog,
} from '../../components/app';
import { ProtectedRoute } from '../../components/auth/protected-route';

/**
 * HomePage component serves as the main application interface for GyaanQuest.
 * It manages the overall state and coordinates between different learning item types.
 */
function HomePageContent() {
  // Data hooks
  const { quests, mutateQuests } = useQuests();
  const { appState, mutateState } = useAppState();
  const { books, mutateBooks } = useBooks();
  const { courses, mutateCourses } = useCourses();
  const { focusState, mutateFocusState } = useFocusState();

  // State management for search, filters, and sorting
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy] = useState<
    'title' | 'xp' | 'category' | 'type' | 'created_at' | 'done'
  >('created_at');
  const [sortOrder] = useState<'asc' | 'desc'>('desc');

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

  // Filter and sort quests
  const filteredQuests = useMemo(() => {
    const filteredQuests = SearchService.searchQuests(quests, search, {
      type: filterType,
      category: filterCategory,
    });
    return QuestService.sortQuests(filteredQuests, sortBy, sortOrder);
  }, [quests, search, filterType, filterCategory, sortBy, sortOrder]);

  // Calculate level info using service
  const levelInfo = useMemo(() => {
    return XPService.calculateLevelInfo(totalXp);
  }, [totalXp]);

  // Calculate badge thresholds using service
  const badgeThresholds = useMemo(() => {
    return XPService.getBadgeThresholdsWithInfo(totalXp);
  }, [totalXp]);

  // Calculate category progress and badges using service
  const questCategoryProgress = useMemo(() => {
    return CategoryBadgeService.getCategoryProgressByType(quests);
  }, [quests]);

  const bookCategoryProgress = useMemo(() => {
    return CategoryBadgeService.getCategoryProgressByType(books);
  }, [books]);

  const courseCategoryProgress = useMemo(() => {
    return CategoryBadgeService.getCategoryProgressByType(courses);
  }, [courses]);

  // Event handlers using services
  const handleAddQuest = useCallback(
    async (data: CreateQuestData) => {
      const result = await QuestService.createQuest(data);
      if (result._tag === 'Success') {
        await mutateQuests();
        toast.success('Quest created successfully!');
      } else {
        toast.error(result.error);
      }
    },
    [mutateQuests]
  );

  const handleToggleDone = useCallback(
    async (quest: Quest) => {
      const result = await QuestService.toggleQuestCompletion(
        quest.id,
        quest.done
      );
      if (result._tag === 'Success') {
        await mutateQuests();
        toast.success(`Quest ${quest.done ? 'uncompleted' : 'completed'}!`);
      } else {
        toast.error(result.error);
      }
    },
    [mutateQuests]
  );

  const handleDeleteQuest = useCallback(
    async (quest: Quest) => {
      const result = await QuestService.deleteQuest(quest.id);
      if (result._tag === 'Success') {
        await mutateQuests();
        toast.success('Quest deleted successfully!');
      } else {
        toast.error(result.error);
      }
    },
    [mutateQuests]
  );

  // Book management handlers using services
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
        let result;
        if (editingBook) {
          result = await BookManagementService.updateBook(editingBook.id, data);
        } else {
          result = await BookManagementService.createBook(
            data as CreateBookData
          );
        }

        if (result._tag === 'Success') {
          await mutateBooks();
          toast.success(result.data.message);
          setIsAddBookDialogOpen(false);
          setEditingBook(null);
        } else {
          toast.error(result.error);
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
        const result = await BookManagementService.deleteBook(bookId);
        if (result._tag === 'Success') {
          await mutateBooks();
          toast.success(result.data.message);
        } else {
          toast.error(result.error);
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
        const result = await BookManagementService.logProgress(
          loggingBook.id,
          data
        );
        if (result._tag === 'Success') {
          await mutateBooks();
          await mutateFocusState();

          // Show success message with XP details
          let message = result.data.message;
          if (result.data.focusBoostXP && result.data.focusBoostXP > 0) {
            message += ` (includes +${result.data.focusBoostXP} focus boost)`;
          }
          if (result.data.finishBonus && result.data.finishBonus > 0) {
            message += ` (includes +${result.data.finishBonus} finish bonus)`;
          }
          if (result.data.isFinished) {
            message += ' 🎉 Book completed!';
          }

          toast.success(message);
          setIsLogBookProgressOpen(false);
          setLoggingBook(null);
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        console.error('Failed to log book progress:', error);
        toast.error('Failed to log progress. Please try again.');
      }
    },
    [loggingBook, mutateBooks, mutateFocusState]
  );

  // Course management handlers using services
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
        let result;
        if (editingCourse) {
          result = await CourseManagementService.updateCourse(
            editingCourse.id,
            data
          );
        } else {
          result = await CourseManagementService.createCourse(
            data as CreateCourseData
          );
        }

        if (result._tag === 'Success') {
          await mutateCourses();
          toast.success(result.data.message);
          setIsAddCourseDialogOpen(false);
          setEditingCourse(null);
        } else {
          toast.error(result.error);
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
        const result = await CourseManagementService.deleteCourse(courseId);
        if (result._tag === 'Success') {
          await mutateCourses();
          toast.success(result.data.message);
        } else {
          toast.error(result.error);
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
        const result = await CourseManagementService.logProgress(
          loggingCourse.id,
          data
        );
        if (result._tag === 'Success') {
          await mutateCourses();
          await mutateFocusState();

          // Show success message with XP details
          let message = result.data.message;
          if (result.data.focusBoostXP && result.data.focusBoostXP > 0) {
            message += ` (includes +${result.data.focusBoostXP} focus boost)`;
          }
          if (result.data.finishBonus && result.data.finishBonus > 0) {
            message += ` (includes +${result.data.finishBonus} finish bonus)`;
          }
          if (result.data.isFinished) {
            message += ' 🎉 Course completed!';
          }

          toast.success(message);
          setIsLogCourseProgressOpen(false);
          setLoggingCourse(null);
        } else {
          toast.error(result.error);
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
        if (id === null) {
          await FocusService.removeFocus(type);
        } else {
          await FocusService.setFocus(type, id);
        }

        await mutateFocusState();
        toast.success(`${type} focus updated successfully!`);
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

        if (isCurrentlyFocused) {
          await FocusService.removeFocus('quest');
          toast.success('Quest removed from focus');
        } else {
          await FocusService.setFocus('quest', quest.id);
          toast.success('Quest added to focus!');
        }

        await mutateFocusState();
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

        if (isCurrentlyFocused) {
          await FocusService.removeFocus('book');
          toast.success('Book removed from focus');
        } else {
          await FocusService.setFocus('book', book.id);
          toast.success('Book added to focus!');
        }

        await mutateFocusState();
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

        if (isCurrentlyFocused) {
          await FocusService.removeFocus('course');
          toast.success('Course removed from focus');
        } else {
          await FocusService.setFocus('course', course.id);
          toast.success('Course added to focus!');
        }

        await mutateFocusState();
      } catch (error) {
        console.error('Failed to toggle course focus:', error);
        toast.error('Failed to update focus. Please try again.');
      }
    },
    [focusState, mutateFocusState]
  );

  // Daily check-in and challenge handlers
  const handleDailyCheckIn = useCallback(async () => {
    const result = await AppStateService.recordDailyCheckIn();

    if (result._tag === 'Failure') {
      toast.error(result.error);
      return;
    }

    await mutateState();
    toast.success('🔥 Streak +1 — see you tomorrow!');
  }, [mutateState]);

  const handleRandomChallenge = useCallback(async () => {
    // First check if all focus slots are full
    if (ChallengeService.areAllFocusSlotsFull(focusState)) {
      toast.info(ChallengeService.getAllFocusSlotsFullMessage());
      return;
    }

    const result = await ChallengeService.getRandomChallenge();

    if (result._tag === 'Failure') {
      toast.error(result.error);
      return;
    }

    const challenge = result.data;
    if (!challenge) {
      // This should not happen since we checked focus slots above, but handle gracefully
      toast.info('No challenges available at the moment. Try again later!');
      return;
    }

    // Double-check focus limit based on challenge type (safety check)
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
        {/* Progress Overview */}
        <ProgressOverview
          levelInfo={levelInfo}
          totalXp={totalXp}
          xpBreakdown={xpBreakdown}
          badgeThresholds={badgeThresholds}
          appState={appState}
          focusState={focusState}
          onCheckIn={handleDailyCheckIn}
          onRandomChallenge={handleRandomChallenge}
        />

        {/* Focus Row for 1+1+1 System */}
        <FocusRow
          focusState={focusState || {}}
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
              <BulkSetupDialog
                onDataRefresh={() => {
                  // Refresh all data after bulk setup
                  mutateQuests();
                  mutateBooks();
                  mutateCourses();
                  mutateFocusState();
                }}
              />
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
                      className='border rounded-lg data-[state=open]:border-blue-400 data-[state=open]:shadow-[0_0_0_1px_rgba(59,130,246,0.4)] data-[state=open]:shadow-blue-500/30 transition-all duration-300'
                    >
                      <AccordionTrigger className='px-4 py-3 hover:no-underline data-[state=open]:text-blue-600'>
                        <div className='flex items-center gap-2'>
                          <span className='text-sm font-medium text-foreground'>
                            Progress by Category
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

                  <QuestList
                    quests={quests}
                    filteredQuests={filteredQuests}
                    search={search}
                    filterType={filterType}
                    filterCategory={filterCategory}
                    categories={categories}
                    onSearchChange={setSearch}
                    onFilterTypeChange={setFilterType}
                    onFilterCategoryChange={setFilterCategory}
                    onToggleDone={handleToggleDone}
                    onToggleFocus={handleToggleQuestFocus}
                    onDelete={handleDeleteQuest}
                    getIsInFocus={questId => focusState?.quest?.id === questId}
                  />
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
                      className='border rounded-lg data-[state=open]:border-green-400 data-[state=open]:shadow-[0_0_0_1px_rgba(34,197,94,0.4)] data-[state=open]:shadow-green-500/30 transition-all duration-300'
                    >
                      <AccordionTrigger className='px-4 py-3 hover:no-underline data-[state=open]:text-green-600'>
                        <div className='flex items-center gap-2'>
                          <span className='text-sm font-medium text-foreground'>
                            Progress by Category
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
                                  <div className='flex items-center gap-1'>
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
                      className='border rounded-lg data-[state=open]:border-purple-400 data-[state=open]:shadow-[0_0_0_1px_rgba(168,85,247,0.4)] data-[state=open]:shadow-purple-500/30 transition-all duration-300'
                    >
                      <AccordionTrigger className='px-4 py-3 hover:no-underline data-[state=open]:text-purple-600'>
                        <div className='flex items-center gap-2'>
                          <span className='text-sm font-medium text-foreground'>
                            Progress by Category
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
                                  <div className='flex items-center gap-1'>
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

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomePageContent />
    </ProtectedRoute>
  );
}
