import { AppState } from '../lib/types';
import { Result, succeed, fail } from '../lib/result';

export interface UpdateAppStateData {
  streak?: number;
  last_check_in?: Date;
  focus?: string[];
}

export class AppStateService {
  /**
   * Records a daily check-in and updates streak
   */
  static async recordDailyCheckIn(): Promise<Result<AppState>> {
    const response = await fetch('/api/checkin', {
      method: 'POST',
    });

    if (!response.ok) {
      return fail('Failed to record daily check-in');
    }

    const appState = await response.json();
    return succeed(appState);
  }

  /**
   * Updates application state
   */
  static async updateAppState(
    data: UpdateAppStateData
  ): Promise<Result<AppState>> {
    const response = await fetch('/api/app-state', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return fail('Failed to update app state');
    }

    const appState = await response.json();
    return succeed(appState);
  }

  /**
   * Toggles focus on a quest
   */
  static async toggleQuestFocus(
    questId: string,
    currentFocus: string[],
    maxFocus: number = 3
  ): Promise<Result<AppState>> {
    const focus = new Set(currentFocus);

    if (focus.has(questId)) {
      focus.delete(questId);
    } else {
      if (focus.size >= maxFocus) {
        return fail(`Maximum focus limit of ${maxFocus} reached`);
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
  ): Promise<Result<AppState>> {
    if (currentFocus.length >= maxFocus) {
      return fail(`Maximum focus limit of ${maxFocus} reached`);
    }

    if (currentFocus.includes(questId)) {
      return fail('Quest is already in focus');
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
  ): Promise<Result<AppState>> {
    if (!currentFocus.includes(questId)) {
      return fail('Quest is not in focus');
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
