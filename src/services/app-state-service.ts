import { AppState } from '@/lib/types';

export interface UpdateAppStateData {
  streak?: number;
  last_check_in?: Date;
  focus?: string[];
}

export class AppStateService {
  /**
   * Records a daily check-in and updates streak
   */
  static async recordDailyCheckIn(): Promise<AppState> {
    const response = await fetch('/api/checkin', {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to record daily check-in');
    }

    return response.json();
  }

  /**
   * Updates application state
   */
  static async updateAppState(data: UpdateAppStateData): Promise<AppState> {
    const response = await fetch('/api/app-state', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update app state');
    }

    return response.json();
  }

  /**
   * Toggles focus on a quest
   */
  static async toggleQuestFocus(
    questId: string,
    currentFocus: string[],
    maxFocus: number = 3
  ): Promise<AppState> {
    const focus = new Set(currentFocus);

    if (focus.has(questId)) {
      focus.delete(questId);
    } else {
      if (focus.size >= maxFocus) {
        throw new Error(`Maximum focus limit of ${maxFocus} reached`);
      }
      focus.add(questId);
    }

    return this.updateAppState({ focus: Array.from(focus) });
  }

  /**
   * Adds a quest to focus
   */
  static async addQuestToFocus(
    questId: string,
    currentFocus: string[],
    maxFocus: number = 3
  ): Promise<AppState> {
    if (currentFocus.length >= maxFocus) {
      throw new Error(`Maximum focus limit of ${maxFocus} reached`);
    }

    if (currentFocus.includes(questId)) {
      throw new Error('Quest is already in focus');
    }

    const newFocus = [...currentFocus, questId];
    return this.updateAppState({ focus: newFocus });
  }

  /**
   * Removes a quest from focus
   */
  static async removeQuestFromFocus(
    questId: string,
    currentFocus: string[]
  ): Promise<AppState> {
    if (!currentFocus.includes(questId)) {
      throw new Error('Quest is not in focus');
    }

    const newFocus = currentFocus.filter(id => id !== questId);
    return this.updateAppState({ focus: newFocus });
  }

  /**
   * Gets the current focus count
   */
  static getFocusCount(focus: string[]): number {
    return focus.length;
  }

  /**
   * Checks if a quest is in focus
   */
  static isQuestInFocus(questId: string, focus: string[]): boolean {
    return focus.includes(questId);
  }

  /**
   * Gets the remaining focus slots available
   */
  static getRemainingFocusSlots(focus: string[], maxFocus: number = 3): number {
    return Math.max(0, maxFocus - focus.length);
  }

  /**
   * Formats the last check-in date for display
   */
  static formatLastCheckIn(lastCheckIn: string | null): string {
    if (!lastCheckIn) return '—';
    return new Date(lastCheckIn).toLocaleDateString();
  }

  /**
   * Checks if today's check-in has already been recorded
   */
  static isTodayCheckedIn(lastCheckIn: string | null): boolean {
    if (!lastCheckIn) return false;

    const today = new Date().toISOString().slice(0, 10);
    const lastCheck = new Date(lastCheckIn).toISOString().slice(0, 10);

    return today === lastCheck;
  }
}
