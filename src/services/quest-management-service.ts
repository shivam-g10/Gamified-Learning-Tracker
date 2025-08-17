import { Quest } from '../lib/types';
import { CreateQuestData } from './quest-service';
import { QuestService } from './quest-service';
import { Result, succeed, fail } from '../lib/result';

export interface QuestManagementResult {
  message: string;
  quest?: Quest;
}

/**
 * QuestManagementService handles business logic for quest operations
 * including validation, error handling, and user feedback messages.
 */
export class QuestManagementService {
  /**
   * Creates a new quest with proper validation and error handling
   */
  static async createQuest(
    data: CreateQuestData
  ): Promise<Result<QuestManagementResult>> {
    // Validate quest data
    if (!data.title?.trim()) {
      return fail('Quest title is required');
    }

    if (data.xp <= 0) {
      return fail('XP must be greater than 0');
    }

    if (!data.type || !['topic', 'project', 'bonus'].includes(data.type)) {
      return fail('Invalid quest type');
    }

    if (!data.category?.trim()) {
      return fail('Category is required');
    }

    // Create the quest
    const result = await QuestService.createQuest(data);

    if (result._tag === 'Failure') {
      return fail(result.error);
    }

    return succeed({
      message: 'Quest added successfully!',
      quest: result.data,
    });
  }

  /**
   * Toggles quest completion with proper feedback
   */
  static async toggleQuestCompletion(
    quest: Quest
  ): Promise<Result<QuestManagementResult>> {
    const result = await QuestService.toggleQuestCompletion(
      quest.id,
      quest.done
    );

    if (result._tag === 'Failure') {
      return fail(result.error);
    }

    const message = result.data.done
      ? `Quest completed! +${quest.xp} XP earned.`
      : 'Quest marked as incomplete';

    return succeed({
      message,
      quest: result.data,
    });
  }

  /**
   * Deletes a quest with confirmation
   */
  static async deleteQuest(quest: Quest): Promise<Result<{ message: string }>> {
    const result = await QuestService.deleteQuest(quest.id);

    if (result._tag === 'Failure') {
      return fail(result.error);
    }

    return succeed({
      message: 'Quest deleted successfully!',
    });
  }

  /**
   * Gets quest statistics for display
   */
  static getQuestStats(quests: Quest[] | undefined) {
    if (!quests) return { total: 0, completed: 0, pending: 0, totalXp: 0 };

    const total = quests.length;
    const completed = quests.filter(q => q.done).length;
    const pending = total - completed;
    const totalXp = quests
      .filter(q => q.done)
      .reduce((sum, q) => sum + q.xp, 0);

    return { total, completed, pending, totalXp };
  }

  /**
   * Validates quest data before submission
   */
  static validateQuestData(data: CreateQuestData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.title?.trim()) {
      errors.push('Quest title is required');
    }

    if (data.xp <= 0) {
      errors.push('XP must be greater than 0');
    }

    if (!data.type || !['topic', 'project', 'bonus'].includes(data.type)) {
      errors.push('Please select a valid quest type');
    }

    if (!data.category?.trim()) {
      errors.push('Category is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Gets quest type display names
   */
  static getQuestTypeDisplayName(type: string): string {
    const typeNames: Record<string, string> = {
      topic: 'Topic',
      project: 'Project',
      bonus: 'Bonus',
    };
    return typeNames[type] || type;
  }

  /**
   * Gets quest status display information
   */
  static getQuestStatusInfo(quest: Quest) {
    return {
      isCompleted: quest.done,
      statusText: quest.done ? 'Completed' : 'In Progress',
      statusColor: quest.done ? 'text-green-600' : 'text-blue-600',
      xpText: quest.done
        ? `+${quest.xp} XP earned`
        : `+${quest.xp} XP available`,
    };
  }
}
