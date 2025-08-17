export interface LevelInfo {
  level: number;
  progress: number;
  nextLevelXp: number;
  pct: number;
}

export class XPService {
  /**
   * XP required per level
   */
  static readonly XP_PER_LEVEL = 150;

  /**
   * Badge thresholds
   */
  static readonly BADGE_THRESHOLDS = [150, 400, 800, 1200, 2000] as const;

  /**
   * Focus boost multiplier (20% bonus)
   */
  static readonly FOCUS_BOOST_MULTIPLIER = 1.2;

  /**
   * Calculates level information from total XP
   */
  static calculateLevelInfo(totalXp: number): LevelInfo {
    const level = Math.floor(totalXp / this.XP_PER_LEVEL);
    const currentLevelXp = level * this.XP_PER_LEVEL;
    const progress = totalXp - currentLevelXp;
    const nextLevelXp = this.XP_PER_LEVEL;
    const pct = Math.min(100, Math.round((progress / this.XP_PER_LEVEL) * 100));

    return { level, progress, nextLevelXp, pct };
  }

  /**
   * Alias for calculateLevelInfo for backward compatibility
   */
  static totalXpToLevel(totalXp: number): LevelInfo {
    return this.calculateLevelInfo(totalXp);
  }

  /**
   * Gets the current level from total XP
   */
  static getCurrentLevel(totalXp: number): number {
    return Math.floor(totalXp / this.XP_PER_LEVEL);
  }

  /**
   * Gets XP progress within the current level
   */
  static getCurrentLevelProgress(totalXp: number): number {
    const level = this.getCurrentLevel(totalXp);
    const currentLevelXp = level * this.XP_PER_LEVEL;
    return totalXp - currentLevelXp;
  }

  /**
   * Gets XP required for the next level
   */
  static getXpForNextLevel(): number {
    return this.XP_PER_LEVEL;
  }

  /**
   * Gets XP required to reach a specific level
   */
  static getXpForLevel(targetLevel: number): number {
    return targetLevel * this.XP_PER_LEVEL;
  }

  /**
   * Gets the percentage progress within the current level
   */
  static getCurrentLevelPercentage(totalXp: number): number {
    const progress = this.getCurrentLevelProgress(totalXp);
    return Math.min(100, Math.round((progress / this.XP_PER_LEVEL) * 100));
  }

  /**
   * Gets all badge thresholds
   */
  static getBadgeThresholds(): readonly number[] {
    return this.BADGE_THRESHOLDS;
  }

  /**
   * Gets the next badge threshold to reach
   */
  static getNextBadgeThreshold(totalXp: number): number | null {
    const nextThreshold = this.BADGE_THRESHOLDS.find(
      threshold => threshold > totalXp
    );
    return nextThreshold || null;
  }

  /**
   * Gets the last badge threshold reached
   */
  static getLastBadgeThreshold(totalXp: number): number | null {
    const reachedThresholds = this.BADGE_THRESHOLDS.filter(
      threshold => threshold <= totalXp
    );
    return reachedThresholds.length > 0
      ? reachedThresholds[reachedThresholds.length - 1]
      : null;
  }

  /**
   * Checks if a badge threshold has been reached
   */
  static hasReachedBadgeThreshold(totalXp: number, threshold: number): boolean {
    return totalXp >= threshold;
  }

  /**
   * Gets all reached badge thresholds
   */
  static getReachedBadgeThresholds(totalXp: number): number[] {
    return this.BADGE_THRESHOLDS.filter(threshold => threshold <= totalXp);
  }

  /**
   * Gets all unreached badge thresholds
   */
  static getUnreachedBadgeThresholds(totalXp: number): number[] {
    return this.BADGE_THRESHOLDS.filter(threshold => threshold > totalXp);
  }

  /**
   * Gets the name of a badge for a given threshold
   */
  static getBadgeName(threshold: number): string {
    switch (threshold) {
      case 150:
        return 'Bronze';
      case 400:
        return 'Silver';
      case 800:
        return 'Gold';
      case 1200:
        return 'Epic';
      case 2000:
        return 'Legendary';
      default:
        return `${threshold} XP`;
    }
  }

  /**
   * Calculates XP needed to reach the next badge
   */
  static getXpToNextBadge(totalXp: number): number | null {
    const nextThreshold = this.getNextBadgeThreshold(totalXp);
    if (!nextThreshold) return null;
    return nextThreshold - totalXp;
  }

  /**
   * Gets a formatted string representation of level progress
   */
  static getLevelProgressString(totalXp: number): string {
    const levelInfo = this.calculateLevelInfo(totalXp);
    return `${levelInfo.progress}/${levelInfo.nextLevelXp} XP`;
  }

  /**
   * Gets a formatted string representation of total XP
   */
  static getTotalXpString(totalXp: number): string {
    return `${totalXp} / ∞ XP`;
  }

  // New methods for Books and Courses

  /**
   * Calculates XP for book reading session with optional focus boost
   */
  static calculateBookSessionXP(
    pagesRead: number,
    isInFocus: boolean = false
  ): number {
    const baseXP = Math.ceil(pagesRead / 5);
    return isInFocus
      ? Math.round(baseXP * this.FOCUS_BOOST_MULTIPLIER)
      : baseXP;
  }

  /**
   * Calculates finish bonus XP for books
   */
  static calculateBookFinishBonus(totalPages: number): number {
    return Math.min(50, Math.ceil(totalPages / 10));
  }

  /**
   * Calculates XP for course session with optional focus boost
   */
  static calculateCourseSessionXP(
    unitsDelta: number,
    isInFocus: boolean = false
  ): number {
    const baseXP = 5 * unitsDelta;
    return isInFocus
      ? Math.round(baseXP * this.FOCUS_BOOST_MULTIPLIER)
      : baseXP;
  }

  /**
   * Calculates finish bonus XP for courses
   */
  static calculateCourseFinishBonus(totalUnits: number): number {
    return 10 + Math.ceil(totalUnits / 2);
  }

  /**
   * Applies focus boost to XP if item is in focus
   */
  static applyFocusBoost(baseXP: number, isInFocus: boolean): number {
    return isInFocus
      ? Math.round(baseXP * this.FOCUS_BOOST_MULTIPLIER)
      : baseXP;
  }

  /**
   * Gets focus boost multiplier
   */
  static getFocusBoostMultiplier(): number {
    return this.FOCUS_BOOST_MULTIPLIER;
  }

  /**
   * Gets focus boost percentage
   */
  static getFocusBoostPercentage(): number {
    return Math.round((this.FOCUS_BOOST_MULTIPLIER - 1) * 100);
  }

  /**
   * Calculates total XP from all learning sources including progress sessions
   */
  static calculateTotalXP(
    quests: Array<{ xp: number; done: boolean }>,
    books: Array<{
      total_pages: number;
      status: string;
      current_page: number;
    }> = [],
    courses: Array<{
      total_units: number;
      status: string;
      completed_units: number;
    }> = []
  ): number {
    let totalXP = 0;

    // Add XP from completed quests
    quests.forEach(quest => {
      if (quest.done) {
        totalXP += quest.xp;
      }
    });

    // Add XP from book progress (all sessions, not just finished)
    books.forEach(book => {
      if (book.current_page > 0) {
        // Calculate XP from current progress
        const pagesRead = book.current_page;
        const sessionXP = this.calculateBookSessionXP(pagesRead, false);
        totalXP += sessionXP;

        // Add finish bonus if book is finished
        if (book.status === 'finished') {
          const finishBonus = this.calculateBookFinishBonus(book.total_pages);
          totalXP += finishBonus;
        }
      }
    });

    // Add XP from course progress (all sessions, not just finished)
    courses.forEach(course => {
      if (course.completed_units > 0) {
        // Calculate XP from current progress
        const unitsCompleted = course.completed_units;
        const sessionXP = this.calculateCourseSessionXP(unitsCompleted, false);
        totalXP += sessionXP;

        // Add finish bonus if course is finished
        if (course.status === 'finished') {
          const finishBonus = this.calculateCourseFinishBonus(
            course.total_units
          );
          totalXP += finishBonus;
        }
      }
    });

    return totalXP;
  }

  /**
   * Gets XP breakdown by source including progress sessions
   */
  static getXPBreakdown(
    quests: Array<{ xp: number; done: boolean }>,
    books: Array<{
      total_pages: number;
      status: string;
      current_page: number;
    }> = [],
    courses: Array<{
      total_units: number;
      status: string;
      completed_units: number;
    }> = []
  ): {
    quests: number;
    books: number;
    courses: number;
    total: number;
  } {
    let questXP = 0;
    let bookXP = 0;
    let courseXP = 0;

    // Calculate quest XP
    quests.forEach(quest => {
      if (quest.done) {
        questXP += quest.xp;
      }
    });

    // Calculate book XP from progress sessions
    books.forEach(book => {
      if (book.current_page > 0) {
        const pagesRead = book.current_page;
        const sessionXP = this.calculateBookSessionXP(pagesRead, false);
        bookXP += sessionXP;

        // Add finish bonus if book is finished
        if (book.status === 'finished') {
          const finishBonus = this.calculateBookFinishBonus(book.total_pages);
          bookXP += finishBonus;
        }
      }
    });

    // Calculate course XP from progress sessions
    courses.forEach(course => {
      if (course.completed_units > 0) {
        const unitsCompleted = course.completed_units;
        const sessionXP = this.calculateCourseSessionXP(unitsCompleted, false);
        courseXP += sessionXP;

        // Add finish bonus if course is finished
        if (course.status === 'finished') {
          const finishBonus = this.calculateCourseFinishBonus(
            course.total_units
          );
          courseXP += finishBonus;
        }
      }
    });

    return {
      quests: questXP,
      books: bookXP,
      courses: courseXP,
      total: questXP + bookXP + courseXP,
    };
  }

  /**
   * Gets all badge thresholds with names, colors, and earned status
   */
  static getBadgeThresholdsWithInfo(totalXp: number): Array<{
    threshold: number;
    name: string;
    earned: boolean;
    color: string;
  }> {
    return this.BADGE_THRESHOLDS.map(threshold => ({
      threshold,
      name: this.getBadgeName(threshold),
      earned: totalXp >= threshold,
      color: this.getBadgeColor(threshold),
    }));
  }

  /**
   * Gets the color for a badge threshold
   */
  static getBadgeColor(threshold: number): string {
    switch (threshold) {
      case 150:
        return 'bg-amber-600';
      case 400:
        return 'bg-gray-500';
      case 800:
        return 'bg-yellow-500';
      case 1200:
        return 'bg-purple-600';
      case 2000:
        return 'bg-orange-600';
      default:
        return 'bg-blue-500';
    }
  }
}
