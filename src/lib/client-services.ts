// Client-safe service methods that can be imported on the client side
// These methods don't include Prisma client imports

import type { Quest } from './types';
import type { CreateQuestData } from './client-types';
import { Result, succeed, fail } from './result';

export class ClientQuestService {
  /**
   * Sorts quests by specified field and order
   */
  static sortQuests(
    quests: Quest[],
    sortBy: keyof Quest,
    sortOrder: 'asc' | 'desc'
  ): Quest[] {
    const sortedQuests = [...quests].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      // Handle special cases
      if (sortBy === 'done') {
        // Sort done quests to the bottom
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

    return sortedQuests;
  }

  /**
   * Creates a new quest via API call
   */
  static async createQuest(data: CreateQuestData): Promise<Result<string>> {
    const response = await fetch('/api/quests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return fail('Failed to create quest. Please try again.');
    }

    return succeed('Quest created successfully!');
  }

  /**
   * Toggles quest completion via API call
   */
  static async toggleQuestCompletion(quest: Quest): Promise<Result<string>> {
    const response = await fetch(`/api/quests/${quest.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ done: !quest.done }),
    });

    if (!response.ok) {
      return fail('Failed to toggle quest completion. Please try again.');
    }

    return succeed(`Quest ${quest.done ? 'uncompleted' : 'completed'}!`);
  }

  /**
   * Deletes a quest via API call
   */
  static async deleteQuest(quest: Quest): Promise<Result<{ message: string }>> {
    const response = await fetch(`/api/quests/${quest.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      return fail('Failed to delete quest. Please try again.');
    }

    return succeed({
      message: 'Quest deleted successfully!',
    });
  }
}

export class ClientAppStateService {
  /**
   * Records a daily check-in via API call
   */
  static async recordDailyCheckIn(): Promise<Result<void>> {
    const response = await fetch('/api/checkin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return fail('Failed to record check-in');
    }

    return succeed(undefined);
  }
}
