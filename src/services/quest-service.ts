'use client';

import { Quest } from '../lib/types';
import { Result } from '../lib/result';
import { QuestAPI } from '../lib/api';

export interface CreateQuestData {
  title: string;
  description?: string;
  xp: number;
  type: 'topic' | 'project' | 'bonus';
  category: string;
}

export interface UpdateQuestData {
  done?: boolean;
  title?: string;
  description?: string;
  xp?: number;
  type?: 'topic' | 'project' | 'bonus';
  category?: string;
}

export class QuestService {
  /**
   * Creates a new quest
   */
  static async createQuest(data: CreateQuestData): Promise<Result<Quest>> {
    return QuestAPI.createQuest(data);
  }

  /**
   * Updates an existing quest
   */
  static async updateQuest(
    id: string,
    data: UpdateQuestData
  ): Promise<Result<Quest>> {
    return QuestAPI.updateQuest(id, data);
  }

  /**
   * Deletes a quest
   */
  static async deleteQuest(id: string): Promise<Result<void>> {
    return QuestAPI.deleteQuest(id);
  }

  /**
   * Toggles the completion status of a quest
   */
  static async toggleQuestCompletion(
    id: string,
    currentDone: boolean
  ): Promise<Result<Quest>> {
    return this.updateQuest(id, { done: !currentDone });
  }

  /**
   * Gets a random unfinished quest for challenges
   */
  static async getRandomChallenge(): Promise<Result<Quest | null>> {
    return QuestAPI.getRandomChallenge();
  }

  /**
   * Calculates total XP from completed quests
   */
  static calculateTotalXp(quests: Quest[]): number {
    return quests.filter(q => q.done).reduce((sum, q) => sum + q.xp, 0);
  }

  /**
   * Gets unique categories from quests
   */
  static getUniqueCategories(quests: Quest[]): string[] {
    const categories = new Set<string>();
    quests.forEach(q => categories.add(q.category));
    return Array.from(categories).sort();
  }

  /**
   * Filters quests based on search criteria
   */
  static filterQuests(
    quests: Quest[],
    search: string,
    filterType: string,
    filterCategory: string
  ): Quest[] {
    return quests.filter(q => {
      if (
        search &&
        !`${q.title} ${q.category}`.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      if (filterType && filterType !== 'all' && q.type !== filterType) {
        return false;
      }
      if (
        filterCategory &&
        filterCategory !== 'all' &&
        q.category !== filterCategory
      ) {
        return false;
      }
      return true;
    });
  }

  /**
   * Sorts quests based on criteria and order
   */
  static sortQuests(
    quests: Quest[],
    sortBy: keyof Quest,
    sortOrder: 'asc' | 'desc'
  ): Quest[] {
    return [...quests].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      // Handle special cases
      if (sortBy === 'done') {
        if (aValue === bValue) return 0;
        return aValue ? 1 : -1;
      }

      // Handle string comparisons
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const aLower = aValue.toLowerCase();
        const bLower = bValue.toLowerCase();
        if (aLower < bLower) return sortOrder === 'asc' ? -1 : 1;
        if (aLower > bLower) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      }

      // Handle numeric comparisons
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle boolean comparisons
      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        if (aValue === bValue) return 0;
        return aValue ? 1 : -1;
      }

      return 0;
    });
  }

  /**
   * Calculates category progress statistics
   */
  static getCategoryProgress(quests: Quest[]): Array<{
    category: string;
    total: number;
    done: number;
    percentage: number;
  }> {
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
}
