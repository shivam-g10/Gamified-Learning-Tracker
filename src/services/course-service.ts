'use client';

import { XPService } from './xp-service';
import type {
  Course,
  CourseProgressEntry,
  CreateCourseData,
  UpdateCourseData,
  LogCourseProgressData,
} from '../lib/types';

import { CourseAPI } from '../lib/api';

export class CourseService {
  /**
   * Creates a new course
   */
  static async createCourse(data: CreateCourseData): Promise<Course> {
    const result = await CourseAPI.createCourse(data);
    if (result._tag === 'Failure') {
      throw new Error(result.error);
    }
    return result.data;
  }

  /**
   * Gets all courses with optional filtering
   */
  static async getCourses(filters?: {
    status?: 'backlog' | 'learning' | 'finished';
    search?: string;
    tags?: string[];
    platform?: string;
  }): Promise<Course[]> {
    const result = await CourseAPI.getAllCourses();
    if (result._tag === 'Failure') {
      throw new Error(result.error);
    }

    let courses = result.data;

    // Apply filters client-side since the API doesn't support complex filtering yet
    if (filters?.status) {
      courses = courses.filter(course => course.status === filters.status);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      courses = courses.filter(
        course =>
          course.title.toLowerCase().includes(searchLower) ||
          (course.description &&
            course.description.toLowerCase().includes(searchLower)) ||
          (course.platform &&
            course.platform.toLowerCase().includes(searchLower))
      );
    }

    if (filters?.tags && filters.tags.length > 0) {
      courses = courses.filter(course =>
        filters.tags!.some(tag => course.tags.includes(tag))
      );
    }

    if (filters?.platform) {
      courses = courses.filter(
        course =>
          course.platform &&
          course.platform
            .toLowerCase()
            .includes(filters.platform!.toLowerCase())
      );
    }

    return courses.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }

  /**
   * Gets a course by ID
   */
  static async getCourseById(id: string): Promise<Course | null> {
    const result = await CourseAPI.getCourseById(id);
    if (result._tag === 'Failure') {
      throw new Error(result.error);
    }
    return result.data;
  }

  /**
   * Updates a course
   */
  static async updateCourse(
    id: string,
    data: UpdateCourseData
  ): Promise<Course> {
    const result = await CourseAPI.updateCourse(id, data);
    if (result._tag === 'Failure') {
      throw new Error(result.error);
    }
    return result.data;
  }

  /**
   * Deletes a course
   */
  static async deleteCourse(id: string): Promise<void> {
    const result = await CourseAPI.deleteCourse(id);
    if (result._tag === 'Failure') {
      throw new Error(result.error);
    }
  }

  /**
   * Logs progress for a course and awards XP
   */
  static async logProgress(
    courseId: string,
    data: LogCourseProgressData,
    isInFocus: boolean = false
  ): Promise<{
    course: Course;
    xpEarned: number;
    isFinished: boolean;
    finishBonus: number;
  }> {
    const course = await this.getCourseById(courseId);

    if (!course) {
      throw new Error('Course not found');
    }

    // Validate progress
    if (data.units_delta <= 0) {
      throw new Error('Units delta must be positive');
    }

    if (course.completed_units + data.units_delta > course.total_units) {
      throw new Error('Units completed would exceed total units');
    }

    // Create progress entry and update course via API
    const result = await CourseAPI.logProgress(courseId, data);
    if (result._tag === 'Failure') {
      throw new Error(result.error);
    }

    const updatedCourse = result.data;

    // Calculate XP with focus boost
    const sessionXP = XPService.calculateCourseSessionXP(
      data.units_delta,
      isInFocus
    );
    const finishBonus =
      updatedCourse.completed_units >= course.total_units
        ? XPService.calculateCourseFinishBonus(course.total_units)
        : 0;
    const totalXP = sessionXP + finishBonus;
    const isFinished = updatedCourse.completed_units >= course.total_units;

    return {
      course: updatedCourse,
      xpEarned: totalXP,
      isFinished,
      finishBonus,
    };
  }

  /**
   * Calculates XP for a course session (deprecated - use XPService)
   */
  static calculateSessionXP(unitsDelta: number): number {
    return XPService.calculateCourseSessionXP(unitsDelta, false);
  }

  /**
   * Calculates finish bonus XP (deprecated - use XPService)
   */
  static calculateFinishBonus(totalUnits: number): number {
    return XPService.calculateCourseFinishBonus(totalUnits);
  }

  /**
   * Gets total units completed across all courses
   */
  static async getTotalUnitsCompleted(): Promise<number> {
    // This would need to be implemented in the API or calculated client-side
    // For now, we'll get all courses and calculate the total
    const courses = await this.getCourses();
    return courses.reduce((total, course) => total + course.completed_units, 0);
  }

  /**
   * Gets courses by status
   */
  static async getCoursesByStatus(
    status: 'backlog' | 'learning' | 'finished'
  ): Promise<Course[]> {
    const result = await CourseAPI.getCoursesByStatus(status);
    if (result._tag === 'Failure') {
      throw new Error(result.error);
    }
    return result.data.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }

  /**
   * Gets learning progress for a course
   */
  static async getCourseProgress(
    courseId: string
  ): Promise<CourseProgressEntry[]> {
    const result = await CourseAPI.getCourseProgressHistory(courseId);
    if (result._tag === 'Failure') {
      throw new Error(result.error);
    }
    return result.data;
  }

  /**
   * Calculates course progress percentage
   */
  static calculateProgressPercentage(
    completedUnits: number,
    totalUnits: number
  ): number {
    if (totalUnits === 0) return 0;
    return Math.min(100, Math.round((completedUnits / totalUnits) * 100));
  }

  /**
   * Gets courses that need attention (started but not finished)
   */
  static async getActiveCourses(): Promise<Course[]> {
    const courses = await this.getCourses();
    return courses
      .filter(
        course => course.status === 'learning' && course.completed_units > 0
      )
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
  }

  /**
   * Gets courses by platform
   */
  static async getCoursesByPlatform(platform: string): Promise<Course[]> {
    const result = await CourseAPI.getCoursesByPlatform(platform);
    if (result._tag === 'Failure') {
      throw new Error(result.error);
    }
    return result.data.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }

  /**
   * Gets unique platforms
   */
  static async getUniquePlatforms(): Promise<string[]> {
    const courses = await this.getCourses();
    const platforms = courses
      .map(course => course.platform)
      .filter((platform): platform is string => platform !== null);

    return [...new Set(platforms)];
  }
}
