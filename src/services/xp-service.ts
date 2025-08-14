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
}
