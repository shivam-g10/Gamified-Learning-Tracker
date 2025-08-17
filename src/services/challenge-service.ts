import { FocusState } from '../lib/types';
import type { ChallengeItem } from '../lib/client-types';
import { Result, succeed, fail } from '../lib/result';

export type { ChallengeItem } from '../lib/client-types';

export class ChallengeService {
  /**
   * Gets a random unfinished learning item for challenges
   */
  static async getRandomChallenge(): Promise<Result<ChallengeItem | null>> {
    const response = await fetch('/api/random-challenge');

    if (!response.ok) {
      return fail('Failed to get random challenge');
    }

    const item = await response.json();
    return succeed(item);
  }

  /**
   * Checks if a quest can be added to focus (only 1 quest allowed)
   */
  static canAddQuestToFocus(currentFocusState: FocusState): boolean {
    return !currentFocusState?.quest;
  }

  /**
   * Checks if a book can be added to focus (only 1 book allowed)
   */
  static canAddBookToFocus(currentFocusState: FocusState): boolean {
    return !currentFocusState?.book;
  }

  /**
   * Checks if a course can be added to focus (only 1 course allowed)
   */
  static canAddCourseToFocus(currentFocusState: FocusState): boolean {
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
    return `Challenge accepted! "${item.title}" added to focus.`;
  }

  /**
   * Gets challenge type display name
   */
  static getChallengeTypeDisplayName(
    type: 'quest' | 'book' | 'course'
  ): string {
    switch (type) {
      case 'quest':
        return 'Quest';
      case 'book':
        return 'Book';
      case 'course':
        return 'Course';
      default:
        return type;
    }
  }

  /**
   * Gets challenge type icon
   */
  static getChallengeTypeIcon(type: 'quest' | 'book' | 'course'): string {
    switch (type) {
      case 'quest':
        return '🎯';
      case 'book':
        return '📚';
      case 'course':
        return '🎓';
      default:
        return '📝';
    }
  }
}
