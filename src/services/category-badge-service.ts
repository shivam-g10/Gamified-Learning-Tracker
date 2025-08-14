import { Quest } from '../lib/types';

export interface CategoryProgress {
  category: string;
  total: number;
  done: number;
  percentage: number;
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
   * Calculates category progress statistics
   */
  static getCategoryProgress(quests: Quest[]): CategoryProgress[] {
    const byCategory = new Map<string, { total: number; done: number }>();

    quests.forEach(q => {
      const item = byCategory.get(q.category) || { total: 0, done: 0 };
      item.total += q.xp;
      if (q.done) item.done += q.xp;
      byCategory.set(q.category, item);
    });

    return Array.from(byCategory.entries()).map(([category, stats]) => ({
      category,
      total: stats.total,
      done: stats.done,
      percentage:
        stats.total === 0 ? 0 : Math.round((stats.done / stats.total) * 100),
    }));
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
        .find(([badgeName, threshold]) => percentage >= threshold); // eslint-disable-line @typescript-eslint/no-unused-vars

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
      ([badgeName, threshold]) => percentage < threshold
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
      .find(([badgeName, threshold]) => percentage >= threshold); // eslint-disable-line @typescript-eslint/no-unused-vars

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
