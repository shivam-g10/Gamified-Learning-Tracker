import { Quest, Book, Course } from '../lib/types';

export interface CategoryProgress {
  category: string;
  totalItems: number;
  completedItems: number;
  percentage: number;
  quests: { total: number; completed: number };
  books: { total: number; completed: number };
  courses: { total: number; completed: number };
}

export interface CategoryBadge {
  category: string;
  badge: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  earned: boolean;
  threshold: number;
  currentProgress: number;
}

export class CategoryBadgeService {
  /**
   * Badge thresholds for category completion
   */
  static readonly CATEGORY_BADGE_THRESHOLDS = {
    Bronze: 25,
    Silver: 50,
    Gold: 75,
    Platinum: 90,
    Diamond: 100,
  } as const;

  /**
   * Calculates category progress statistics with separate tracking for each type
   */
  static getCategoryProgress(
    quests: Quest[],
    books: Book[] = [],
    courses: Course[] = []
  ): CategoryProgress[] {
    // Combine all items by category
    const categoryMap = new Map<
      string,
      {
        total: number;
        completed: number;
        quests: { total: number; completed: number };
        books: { total: number; completed: number };
        courses: { total: number; completed: number };
      }
    >();

    // Process quests
    quests.forEach(quest => {
      const current = categoryMap.get(quest.category) || {
        total: 0,
        completed: 0,
        quests: { total: 0, completed: 0 },
        books: { total: 0, completed: 0 },
        courses: { total: 0, completed: 0 },
      };
      current.total += 1;
      current.quests.total += 1;
      if (quest.done) {
        current.completed += 1;
        current.quests.completed += 1;
      }
      categoryMap.set(quest.category, current);
    });

    // Process books
    books.forEach(book => {
      const current = categoryMap.get(book.category) || {
        total: 0,
        completed: 0,
        quests: { total: 0, completed: 0 },
        books: { total: 0, completed: 0 },
        courses: { total: 0, completed: 0 },
      };
      current.total += 1;
      current.books.total += 1;
      if (book.status === 'finished') {
        current.completed += 1;
        current.books.completed += 1;
      }
      categoryMap.set(book.category, current);
    });

    // Process courses
    courses.forEach(course => {
      const current = categoryMap.get(course.category) || {
        total: 0,
        completed: 0,
        quests: { total: 0, completed: 0 },
        books: { total: 0, completed: 0 },
        courses: { total: 0, completed: 0 },
      };
      current.total += 1;
      current.courses.total += 1;
      if (course.status === 'finished') {
        current.completed += 1;
        current.courses.completed += 1;
      }
      categoryMap.set(course.category, current);
    });

    // Convert to array and calculate percentages
    return Array.from(categoryMap.entries()).map(
      ([category, { total, completed, quests, books, courses }]) => ({
        category,
        totalItems: total,
        completedItems: completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        quests,
        books,
        courses,
      })
    );
  }

  /**
   * Gets category progress for a specific type only
   */
  static getCategoryProgressByType(
    items: (Quest | Book | Course)[],
    type: 'quests' | 'books' | 'courses'
  ): CategoryProgress[] {
    const categoryMap = new Map<
      string,
      {
        total: number;
        completed: number;
        quests: { total: number; completed: number };
        books: { total: number; completed: number };
        courses: { total: number; completed: number };
      }
    >();

    items.forEach(item => {
      const category = item.category;
      const current = categoryMap.get(category) || {
        total: 0,
        completed: 0,
        quests: { total: 0, completed: 0 },
        books: { total: 0, completed: 0 },
        courses: { total: 0, completed: 0 },
      };

      // Determine if item is completed based on type
      let isCompleted = false;
      if ('done' in item) {
        // Quest
        isCompleted = item.done;
        current.quests.total += 1;
        if (isCompleted) current.quests.completed += 1;
      } else if ('current_page' in item) {
        // Book
        isCompleted = item.status === 'finished';
        current.books.total += 1;
        if (isCompleted) current.books.completed += 1;
      } else {
        // Course
        isCompleted = item.status === 'finished';
        current.courses.total += 1;
        if (isCompleted) current.courses.completed += 1;
      }

      current.total += 1;
      if (isCompleted) current.completed += 1;
      categoryMap.set(category, current);
    });

    return Array.from(categoryMap.entries()).map(
      ([category, { total, completed, quests, books, courses }]) => ({
        category,
        totalItems: total,
        completedItems: completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        quests,
        books,
        courses,
      })
    );
  }

  static getUniqueCategories(
    quests: Quest[],
    books: Book[] = [],
    courses: Course[] = []
  ): string[] {
    const categories = new Set<string>();

    quests.forEach(quest => categories.add(quest.category));
    books.forEach(book => categories.add(book.category));
    courses.forEach(course => categories.add(course.category));

    return Array.from(categories).sort();
  }

  /**
   * Gets categories for a specific type only
   */
  static getCategoriesByType(
    items: (Quest | Book | Course)[],
    type: 'quests' | 'books' | 'courses'
  ): string[] {
    const categories = new Set<string>();
    items.forEach(item => categories.add(item.category));
    return Array.from(categories).sort();
  }

  static getCategoryStats(
    quests: Quest[],
    books: Book[] = [],
    courses: Course[] = []
  ): {
    totalQuests: number;
    totalBooks: number;
    totalCourses: number;
    totalItems: number;
    completedQuests: number;
    completedBooks: number;
    completedCourses: number;
    totalCompleted: number;
  } {
    const totalQuests = quests.length;
    const totalBooks = books.length;
    const totalCourses = courses.length;
    const totalItems = totalQuests + totalBooks + totalCourses;

    const completedQuests = quests.filter(q => q.done).length;
    const completedBooks = books.filter(b => b.status === 'finished').length;
    const completedCourses = courses.filter(
      c => c.status === 'finished'
    ).length;
    const totalCompleted = completedQuests + completedBooks + completedCourses;

    return {
      totalQuests,
      totalBooks,
      totalCourses,
      totalItems,
      completedQuests,
      completedBooks,
      completedCourses,
      totalCompleted,
    };
  }

  /**
   * Gets category badges for all categories
   */
  static getCategoryBadges(quests: Quest[]): CategoryBadge[] {
    const progress = this.getCategoryProgress(quests);

    return progress.map(({ category, percentage }) => {
      const badges = Object.entries(this.CATEGORY_BADGE_THRESHOLDS);
      const earnedBadge = badges
        .reverse() // Start from highest threshold
        .find(([_badgeName, threshold]) => percentage >= threshold); // eslint-disable-line @typescript-eslint/no-unused-vars

      const badgeName =
        (earnedBadge?.[0] as CategoryBadge['badge']) || 'Bronze';
      const threshold = this.CATEGORY_BADGE_THRESHOLDS[badgeName];

      return {
        category,
        badge: badgeName,
        earned: percentage >= threshold,
        threshold,
        currentProgress: percentage,
      };
    });
  }

  /**
   * Gets the next badge to earn for a specific category
   */
  static getNextCategoryBadge(
    category: string,
    quests: Quest[]
  ): CategoryBadge | null {
    const progress = this.getCategoryProgress(quests);
    const categoryProgress = progress.find(p => p.category === category);

    if (!categoryProgress) return null;

    const { percentage } = categoryProgress;
    const nextBadge = Object.entries(this.CATEGORY_BADGE_THRESHOLDS).find(
      ([_badgeName, threshold]) => percentage < threshold
    ); // eslint-disable-line @typescript-eslint/no-unused-vars

    if (!nextBadge) return null;

    return {
      category,
      badge: nextBadge[0] as CategoryBadge['badge'],
      earned: false,
      threshold: nextBadge[1],
      currentProgress: percentage,
    };
  }

  /**
   * Gets the highest earned badge for a specific category
   */
  static getHighestCategoryBadge(
    category: string,
    quests: Quest[]
  ): CategoryBadge | null {
    const progress = this.getCategoryProgress(quests);
    const categoryProgress = progress.find(p => p.category === category);

    if (!categoryProgress) return null;

    const { percentage } = categoryProgress;
    const earnedBadge = Object.entries(this.CATEGORY_BADGE_THRESHOLDS)
      .reverse() // Start from highest threshold
      .find(([_badgeName, threshold]) => percentage >= threshold); // eslint-disable-line @typescript-eslint/no-unused-vars

    if (!earnedBadge) return null;

    return {
      category,
      badge: earnedBadge[0] as CategoryBadge['badge'],
      earned: true,
      threshold: earnedBadge[1],
      currentProgress: percentage,
    };
  }

  /**
   * Gets badge color based on badge type
   */
  static getBadgeColor(badge: CategoryBadge['badge']): string {
    switch (badge) {
      case 'Bronze':
        return 'bg-amber-600';
      case 'Silver':
        return 'bg-gray-500';
      case 'Gold':
        return 'bg-yellow-500';
      case 'Platinum':
        return 'bg-slate-400';
      case 'Diamond':
        return 'bg-cyan-400';
      default:
        return 'bg-muted';
    }
  }

  /**
   * Gets badge icon based on badge type
   */
  static getBadgeIcon(badge: CategoryBadge['badge']): string {
    switch (badge) {
      case 'Bronze':
        return '🥉';
      case 'Silver':
        return '🥈';
      case 'Gold':
        return '🥇';
      case 'Platinum':
        return '💎';
      case 'Diamond':
        return '💠';
      default:
        return '🏆';
    }
  }
}
