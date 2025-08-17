'use client';

import type { Book, Course, Quest } from '../lib/types';

export class UIHelperService {
  /**
   * Gets status badge variant for a book
   */
  static getBookStatusBadge(status: string): {
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    className: string;
  } {
    switch (status) {
      case 'backlog':
        return {
          variant: 'outline',
          className: 'border-gray-500 text-gray-600',
        };
      case 'reading':
        return { variant: 'default', className: 'bg-blue-500 text-white' };
      case 'finished':
        return { variant: 'secondary', className: 'bg-green-500 text-white' };
      default:
        return {
          variant: 'outline',
          className: 'border-gray-500 text-gray-600',
        };
    }
  }

  /**
   * Gets status badge variant for a course
   */
  static getCourseStatusBadge(status: string): {
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    className: string;
  } {
    switch (status) {
      case 'backlog':
        return {
          variant: 'outline',
          className: 'border-gray-500 text-gray-600',
        };
      case 'learning':
        return { variant: 'default', className: 'bg-purple-500 text-white' };
      case 'finished':
        return { variant: 'secondary', className: 'bg-green-500 text-white' };
      default:
        return {
          variant: 'outline',
          className: 'border-gray-500 text-gray-600',
        };
    }
  }

  /**
   * Gets status badge variant for any learning item
   */
  static getStatusBadge(item: Quest | Book | Course): {
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    className: string;
  } {
    if ('done' in item) {
      // Quest
      return item.done
        ? { variant: 'secondary', className: 'bg-green-500 text-white' }
        : { variant: 'outline', className: 'border-gray-500 text-gray-600' };
    } else if ('current_page' in item) {
      // Book
      return this.getBookStatusBadge(item.status);
    } else {
      // Course
      return this.getCourseStatusBadge(item.status);
    }
  }

  /**
   * Gets type icon for a quest
   */
  static getQuestTypeIcon(type: string): string {
    switch (type) {
      case 'topic':
        return '📚';
      case 'project':
        return '🚀';
      case 'bonus':
        return '⭐';
      default:
        return '📝';
    }
  }

  /**
   * Gets type label for a quest
   */
  static getQuestTypeLabel(type: string): string {
    switch (type) {
      case 'topic':
        return 'Topic';
      case 'project':
        return 'Project';
      case 'bonus':
        return 'Bonus';
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
   * Formats date for display
   */
  static formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Gets unique categories from items
   */
  static getUniqueCategories<T extends { category: string }>(
    items: T[]
  ): string[] {
    const categories = new Set<string>();
    items.forEach(item => categories.add(item.category));
    return Array.from(categories).sort();
  }

  /**
   * Gets unique platforms from courses
   */
  static getUniquePlatforms(courses: Course[]): string[] {
    const platforms = new Set<string>();
    courses.forEach(course => {
      if (course.platform) {
        platforms.add(course.platform);
      }
    });
    return Array.from(platforms).sort();
  }
}
