import type { Quest, Book, Course } from '@/lib/types';

export interface SearchFilters {
  status?: string;
  category?: string;
  type?: string;
  platform?: string;
}

export class SearchService {
  /**
   * Search quests with filters
   */
  static searchQuests(
    quests: Quest[],
    search: string,
    filters: SearchFilters
  ): Quest[] {
    return quests.filter(quest => {
      // Text search
      const matchesSearch =
        search === '' ||
        quest.title.toLowerCase().includes(search.toLowerCase()) ||
        quest.category.toLowerCase().includes(search.toLowerCase());

      // Type filter
      const matchesType =
        !filters.type || filters.type === 'all' || quest.type === filters.type;

      // Category filter
      const matchesCategory =
        !filters.category ||
        filters.category === 'all' ||
        quest.category === filters.category;

      return matchesSearch && matchesType && matchesCategory;
    });
  }

  /**
   * Search books with filters
   */
  static searchBooks(
    books: Book[],
    search: string,
    filters: SearchFilters
  ): Book[] {
    return books.filter(book => {
      // Text search
      const matchesSearch =
        search === '' ||
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        (book.author &&
          book.author.toLowerCase().includes(search.toLowerCase())) ||
        book.category.toLowerCase().includes(search.toLowerCase());

      // Status filter
      const matchesStatus =
        !filters.status ||
        filters.status === 'all' ||
        book.status === filters.status;

      // Category filter
      const matchesCategory =
        !filters.category ||
        filters.category === 'all' ||
        book.category === filters.category;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }

  /**
   * Search courses with filters
   */
  static searchCourses(
    courses: Course[],
    search: string,
    filters: SearchFilters
  ): Course[] {
    return courses.filter(course => {
      // Text search
      const matchesSearch =
        search === '' ||
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        (course.platform &&
          course.platform.toLowerCase().includes(search.toLowerCase())) ||
        course.category.toLowerCase().includes(search.toLowerCase());

      // Status filter
      const matchesStatus =
        !filters.status ||
        filters.status === 'all' ||
        course.status === filters.status;

      // Category filter
      const matchesCategory =
        !filters.category ||
        filters.category === 'all' ||
        course.category === filters.category;

      // Platform filter
      const matchesPlatform =
        !filters.platform ||
        filters.platform === 'all' ||
        course.platform === filters.platform;

      return (
        matchesSearch && matchesStatus && matchesCategory && matchesPlatform
      );
    });
  }

  /**
   * Get unique filter options for quests
   */
  static getQuestFilterOptions(quests: Quest[]) {
    const types = [...new Set(quests.map(q => q.type))];
    const categories = [...new Set(quests.map(q => q.category))];

    return {
      types: types.map(type => ({
        value: type,
        label: type.charAt(0).toUpperCase() + type.slice(1),
      })),
      categories: categories.map(category => ({
        value: category,
        label: category,
      })),
    };
  }

  /**
   * Get unique filter options for books
   */
  static getBookFilterOptions(books: Book[]) {
    const statuses = [...new Set(books.map(b => b.status))];
    const categories = [...new Set(books.map(b => b.category))];

    return {
      statuses: statuses.map(status => ({
        value: status,
        label: status.charAt(0).toUpperCase() + status.slice(1),
      })),
      categories: categories.map(category => ({
        value: category,
        label: category,
      })),
    };
  }

  /**
   * Get unique filter options for courses
   */
  static getCourseFilterOptions(courses: Course[]) {
    const statuses = [...new Set(courses.map(c => c.status))];
    const categories = [...new Set(courses.map(c => c.category))];
    const platforms = [
      ...new Set(courses.map(c => c.platform).filter(Boolean)),
    ];

    return {
      statuses: statuses.map(status => ({
        value: status,
        label: status.charAt(0).toUpperCase() + status.slice(1),
      })),
      categories: categories.map(category => ({
        value: category,
        label: category,
      })),
      platforms: platforms.map(platform => ({
        value: platform,
        label: platform,
      })),
    };
  }
}
