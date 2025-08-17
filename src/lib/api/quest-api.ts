'use client';

import type { Quest, CreateQuestData, UpdateQuestData } from '../api-types';
import { Result, succeed, fail } from '../result';

export class QuestAPI {
  static async getAllQuests(): Promise<Result<Quest[]>> {
    try {
      const response = await fetch('/api/quests');
      if (!response.ok) {
        return fail('Failed to fetch quests');
      }
      const data = await response.json();
      return succeed(data);
    } catch (error) {
      return fail('Failed to fetch quests');
    }
  }

  static async createQuest(data: CreateQuestData): Promise<Result<Quest>> {
    try {
      const response = await fetch('/api/quests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        return fail('Failed to create quest');
      }
      const quest = await response.json();
      return succeed(quest);
    } catch (error) {
      return fail('Failed to create quest');
    }
  }

  static async updateQuest(id: string, data: UpdateQuestData): Promise<Result<Quest>> {
    try {
      const response = await fetch(`/api/quests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        return fail('Failed to update quest');
      }
      const quest = await response.json();
      return succeed(quest);
    } catch (error) {
      return fail('Failed to update quest');
    }
  }

  static async deleteQuest(id: string): Promise<Result<void>> {
    try {
      const response = await fetch(`/api/quests/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        return fail('Failed to delete quest');
      }
      return succeed(undefined);
    } catch (error) {
      return fail('Failed to delete quest');
    }
  }

  static async toggleQuestCompletion(id: string): Promise<Result<Quest>> {
    try {
      const response = await fetch(`/api/quests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ done: true }),
      });
      if (!response.ok) {
        return fail('Failed to toggle quest completion');
      }
      const quest = await response.json();
      return succeed(quest);
    } catch (error) {
      return fail('Failed to toggle quest completion');
    }
  }

  static async getRandomChallenge(): Promise<Result<Quest | null>> {
    try {
      const response = await fetch('/api/random-challenge');
      if (!response.ok) {
        return fail('Failed to get random challenge');
      }
      const quest = await response.json();
      return succeed(quest);
    } catch (error) {
      return fail('Failed to get random challenge');
    }
  }
}
