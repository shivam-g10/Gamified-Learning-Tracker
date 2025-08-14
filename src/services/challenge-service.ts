import { Quest, Book, Course } from '../lib/types';

export interface ChallengeItem {
  id: string;
  title: string;
  type: 'quest' | 'book' | 'course';
  category: string;
  xp: number;
}

export class ChallengeService {
  /**
   * Gets a random unfinished quest for challenges
   */
  static async getRandomChallenge(): Promise<ChallengeItem | null> {
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
   * Checks if a quest can be added to focus (only 1 quest allowed)
   */
  static canAddQuestToFocus(currentFocusState: any): boolean {
    return !currentFocusState?.quest;
  }

  /**
   * Checks if a book can be added to focus (only 1 book allowed)
   */
  static canAddBookToFocus(currentFocusState: any): boolean {
    return !currentFocusState?.book;
  }

  /**
   * Checks if a course can be added to focus (only 1 course allowed)
   */
  static canAddCourseToFocus(currentFocusState: any): boolean {
    return !currentFocusState?.course;
  }

  /**
   * Gets focus limit error message for quests
   */
  static getQuestFocusLimitMessage(): string {
    return 'You already have a quest in focus. Complete or remove it first.';
  }

  /**
   * Gets focus limit error message for books
   */
  static getBookFocusLimitMessage(): string {
    return 'You already have a book in focus. Complete or remove it first.';
  }

  /**
   * Gets focus limit error message for courses
   */
  static getCourseFocusLimitMessage(): string {
    return 'You already have a course in focus. Complete or remove it first.';
  }

  /**
   * Gets challenge success message
   */
  static getChallengeSuccessMessage(item: ChallengeItem): string {
    const typeText = item.type === 'quest' ? 'quest' : item.type;
    return `Challenge accepted! "${item.title}" added to focus.`;
  }
}
