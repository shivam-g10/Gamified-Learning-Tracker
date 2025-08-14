import { Quest } from '../lib/types';

export class ChallengeService {
  /**
   * Gets a random unfinished quest for challenges
   */
  static async getRandomChallenge(): Promise<Quest | null> {
    try {
      const response = await fetch('/api/random-challenge');

      if (!response.ok) {
        throw new Error('Failed to get random challenge');
      }

      return response.json();
    } catch (error) {
      console.error('Error getting random challenge:', error);
      return null;
    }
  }

  /**
   * Checks if a quest can be added to focus
   */
  static canAddToFocus(currentFocusCount: number): boolean {
    return currentFocusCount < 3;
  }

  /**
   * Gets focus limit error message
   */
  static getFocusLimitMessage(): string {
    return 'Focus queue is full (3/3). Remove a quest to add another.';
  }

  /**
   * Gets challenge success message
   */
  static getChallengeSuccessMessage(quest: Quest): string {
    return `Challenge accepted! "${quest.title}" added to focus.`;
  }
}
