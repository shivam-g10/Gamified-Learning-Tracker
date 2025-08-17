'use client';

import {
  Course,
  CreateCourseData,
  UpdateCourseData,
  LogCourseProgressData,
} from '../lib/types';
import { CourseService } from './course-service';
import { Result, succeed, fail } from '../lib/result';

export interface CourseManagementResult {
  message: string;
  course?: Course;
}

export interface CourseProgressResult {
  message: string;
  xpEarned?: number;
  focusBoostXP?: number;
  finishBonus?: number;
  isFinished?: boolean;
}

/**
 * CourseManagementService handles business logic for course operations
 * including validation, error handling, and user feedback messages.
 */
export class CourseManagementService {
  /**
   * Creates a new course with proper validation and error handling
   */
  static async createCourse(
    data: CreateCourseData
  ): Promise<Result<CourseManagementResult>> {
    // Validate course data
    if (!data.title?.trim()) {
      return fail('Course title is required');
    }

    if (data.total_units <= 0) {
      return fail('Total units must be greater than 0');
    }

    if (!data.category?.trim()) {
      return fail('Category is required');
    }

    try {
      // Create the course
      const course = await CourseService.createCourse(data);

      return succeed({
        message: 'Course added successfully!',
        course,
      });
    } catch (error) {
      return fail('Failed to add course. Please try again.');
    }
  }

  /**
   * Updates an existing course with proper validation
   */
  static async updateCourse(
    courseId: string,
    data: UpdateCourseData
  ): Promise<Result<CourseManagementResult>> {
    // Validate update data
    if (data.title !== undefined && !data.title?.trim()) {
      return fail('Course title cannot be empty');
    }

    if (data.total_units !== undefined && data.total_units <= 0) {
      return fail('Total units must be greater than 0');
    }

    if (data.completed_units !== undefined && data.completed_units < 0) {
      return fail('Completed units cannot be negative');
    }

    if (
      data.completed_units !== undefined &&
      data.total_units !== undefined &&
      data.completed_units > data.total_units
    ) {
      return fail('Completed units cannot exceed total units');
    }

    try {
      // Update the course
      const course = await CourseService.updateCourse(courseId, data);

      return succeed({
        message: 'Course updated successfully!',
        course,
      });
    } catch (error) {
      return fail('Failed to update course. Please try again.');
    }
  }

  /**
   * Deletes a course with confirmation
   */
  static async deleteCourse(courseId: string): Promise<Result<{ message: string }>> {
    try {
      await CourseService.deleteCourse(courseId);

      return succeed({
        message: 'Course deleted successfully!',
      });
    } catch (error) {
      return fail('Failed to delete course. Please try again.');
    }
  }

  /**
   * Logs course learning progress with XP calculation
   */
  static async logProgress(
    courseId: string,
    data: LogCourseProgressData
  ): Promise<Result<CourseProgressResult>> {
    // Validate progress data
    if (data.units_delta <= 0) {
      return fail('Units completed must be greater than 0');
    }

    try {
      // Log the progress
      const result = await CourseService.logProgress(courseId, data);

      return succeed({
        message: `Progress logged! +${result.xpEarned} XP earned`,
        xpEarned: result.xpEarned,
        focusBoostXP: 0, // Will be calculated by the calling component if needed
        finishBonus: result.finishBonus,
        isFinished: result.isFinished,
      });
    } catch (error) {
      return fail('Failed to log progress. Please try again.');
    }
  }

  /**
   * Gets course statistics for display
   */
  static getCourseStats(courses: Course[] | undefined) {
    if (!courses) return { total: 0, learning: 0, finished: 0, backlog: 0 };

    const total = courses.length;
    const learning = courses.filter(c => c.status === 'learning').length;
    const finished = courses.filter(c => c.status === 'finished').length;
    const backlog = courses.filter(c => c.status === 'backlog').length;

    return { total, learning, finished, backlog };
  }

  /**
   * Validates course data before submission
   */
  static validateCourseData(data: CreateCourseData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.title?.trim()) {
      errors.push('Course title is required');
    }

    if (data.total_units <= 0) {
      errors.push('Total units must be greater than 0');
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
   * Gets course status display information
   */
  static getCourseStatusInfo(course: Course) {
    const statusConfig = {
      backlog: { text: 'Backlog', color: 'text-gray-600', icon: '🎓' },
      learning: { text: 'Learning', color: 'text-blue-600', icon: '📚' },
      finished: { text: 'Finished', color: 'text-green-600', icon: '✅' },
    };

    const config = statusConfig[course.status] || statusConfig.backlog;

    return {
      statusText: config.text,
      statusColor: config.color,
      statusIcon: config.icon,
      progressPercentage:
        course.total_units > 0
          ? Math.round((course.completed_units / course.total_units) * 100)
          : 0,
      unitsText: `${course.completed_units}/${course.total_units} units`,
    };
  }

  /**
   * Calculates learning progress percentage
   */
  static calculateProgressPercentage(course: Course): number {
    if (course.total_units <= 0) return 0;
    return Math.min(
      100,
      Math.round((course.completed_units / course.total_units) * 100)
    );
  }

  /**
   * Gets course category display information
   */
  static getCourseCategoryInfo(courses: Course[] | undefined) {
    if (!courses) return [];

    const categoryMap = new Map<
      string,
      { total: number; completed: number; percentage: number }
    >();

    courses.forEach(course => {
      const current = categoryMap.get(course.category) || {
        total: 0,
        completed: 0,
        percentage: 0,
      };
      current.total += 1;
      if (course.status === 'finished') current.completed += 1;
      categoryMap.set(course.category, current);
    });

    return Array.from(categoryMap.entries()).map(([category, stats]) => ({
      category,
      total: stats.total,
      completed: stats.completed,
      percentage:
        stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
    }));
  }

  /**
   * Gets course platform display information
   */
  static getCoursePlatformInfo(courses: Course[] | undefined) {
    if (!courses) return [];

    const platformMap = new Map<
      string,
      { total: number; completed: number; percentage: number }
    >();

    courses.forEach(course => {
      const platform = course.platform || 'Unknown';
      const current = platformMap.get(platform) || {
        total: 0,
        completed: 0,
        percentage: 0,
      };
      current.total += 1;
      if (course.status === 'finished') current.completed += 1;
      platformMap.set(platform, current);
    });

    return Array.from(platformMap.entries()).map(([platform, stats]) => ({
      platform,
      total: stats.total,
      completed: stats.completed,
      percentage:
        stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
    }));
  }
}
