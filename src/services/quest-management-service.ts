import { Quest } from '../lib/types';
import { CreateQuestData } from './quest-service';
import { QuestService } from './quest-service';

export interface QuestManagementResult {
  success: boolean;
  message: string;
  quest?: Quest;
  error?: string;
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
  ): Promise<QuestManagementResult> {
    try {
      // Validate quest data
      if (!data.title?.trim()) {
        return {
          success: false,
          error: 'Quest title is required',
          message: 'Please provide a quest title',
        };
      }

      if (data.xp <= 0) {
        return {
          success: false,
          error: 'XP must be greater than 0',
          message: 'Please provide a valid XP value',
        };
      }

      if (!data.type || !['topic', 'project', 'bonus'].includes(data.type)) {
        return {
          success: false,
          error: 'Invalid quest type',
          message: 'Please select a valid quest type',
        };
      }

      if (!data.category?.trim()) {
        return {
          success: false,
          error: 'Category is required',
          message: 'Please provide a quest category',
        };
      }

      // Create the quest
      const quest = await QuestService.createQuest(data);

      return {
        success: true,
        message: 'Quest added successfully!',
        quest,
      };
    } catch (error) {
      console.error('Failed to create quest:', error);
      return {
        success: false,
        error: 'Failed to create quest',
        message: 'Failed to add quest. Please try again.',
      };
    }
  }

  /**
   * Toggles quest completion with proper feedback
   */
  static async toggleQuestCompletion(
    quest: Quest
  ): Promise<QuestManagementResult> {
    try {
      const updatedQuest = await QuestService.toggleQuestCompletion(
        quest.id,
        quest.done
      );

      const message = updatedQuest.done
        ? `Quest completed! +${quest.xp} XP earned.`
        : 'Quest marked as incomplete';

      return {
        success: true,
        message,
        quest: updatedQuest,
      };
    } catch (error) {
      console.error('Failed to toggle quest completion:', error);
      return {
        success: false,
        error: 'Failed to update quest',
        message: 'Failed to update quest. Please try again.',
      };
    }
  }

  /**
   * Deletes a quest with confirmation
   */
  static async deleteQuest(quest: Quest): Promise<QuestManagementResult> {
    try {
      await QuestService.deleteQuest(quest.id);

      return {
        success: true,
        message: 'Quest deleted successfully!',
      };
    } catch (error) {
      console.error('Failed to delete quest:', error);
      return {
        success: false,
        error: 'Failed to delete quest',
        message: 'Failed to delete quest. Please try again.',
      };
    }
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
