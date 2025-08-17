'use client';

import type { Course, CourseProgressEntry } from '../types';
import type {
  CreateCourseData,
  UpdateCourseData,
  LogCourseProgressData,
} from '../api-types';
import { Result, succeed, fail } from '../result';

export class CourseAPI {
  static async getAllCourses(): Promise<Result<Course[]>> {
    try {
      const response = await fetch('/api/courses');
      if (!response.ok) {
        return fail('Failed to fetch courses');
      }
      const data = await response.json();
      return succeed(data);
    } catch {
      return fail('Failed to fetch courses');
    }
  }

  static async getCourseById(id: string): Promise<Result<Course>> {
    try {
      const response = await fetch(`/api/courses/${id}`);
      if (!response.ok) {
        return fail('Failed to fetch course');
      }
      const course = await response.json();
      return succeed(course);
    } catch {
      return fail('Failed to fetch course');
    }
  }

  static async createCourse(data: CreateCourseData): Promise<Result<Course>> {
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        return fail('Failed to create course');
      }
      const course = await response.json();
      return succeed(course);
    } catch {
      return fail('Failed to create course');
    }
  }

  static async updateCourse(
    id: string,
    data: UpdateCourseData
  ): Promise<Result<Course>> {
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        return fail('Failed to update course');
      }
      const course = await response.json();
      return succeed(course);
    } catch {
      return fail('Failed to update course');
    }
  }

  static async deleteCourse(id: string): Promise<Result<void>> {
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        return fail('Failed to delete course');
      }
      return succeed(undefined);
    } catch {
      return fail('Failed to delete course');
    }
  }

  static async logProgress(
    id: string,
    data: LogCourseProgressData
  ): Promise<Result<Course>> {
    try {
      const response = await fetch(`/api/courses/${id}/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        return fail('Failed to log progress');
      }
      const course = await response.json();
      return succeed(course);
    } catch {
      return fail('Failed to log progress');
    }
  }

  static async getCoursesByCategory(
    category: string
  ): Promise<Result<Course[]>> {
    try {
      const response = await fetch(
        `/api/courses?category=${encodeURIComponent(category)}`
      );
      if (!response.ok) {
        return fail('Failed to fetch courses by category');
      }
      const data = await response.json();
      return succeed(data);
    } catch {
      return fail('Failed to fetch courses by category');
    }
  }

  static async getCoursesByStatus(status: string): Promise<Result<Course[]>> {
    try {
      const response = await fetch(
        `/api/courses?status=${encodeURIComponent(status)}`
      );
      if (!response.ok) {
        return fail('Failed to fetch courses by status');
      }
      const data = await response.json();
      return succeed(data);
    } catch {
      return fail('Failed to fetch courses by status');
    }
  }

  static async getCoursesByPlatform(
    platform: string
  ): Promise<Result<Course[]>> {
    try {
      const response = await fetch(
        `/api/courses?platform=${encodeURIComponent(platform)}`
      );
      if (!response.ok) {
        return fail('Failed to fetch courses by platform');
      }
      const data = await response.json();
      return succeed(data);
    } catch {
      return fail('Failed to fetch courses by platform');
    }
  }

  static async getCourseProgressHistory(
    id: string
  ): Promise<Result<CourseProgressEntry[]>> {
    try {
      const response = await fetch(`/api/courses/${id}/progress`);
      if (!response.ok) {
        return fail('Failed to fetch course progress history');
      }
      const data = await response.json();
      return succeed(data.progressEntries);
    } catch {
      return fail('Failed to fetch course progress history');
    }
  }
}
