import { prisma } from '@/lib/db';
import { XPService } from './xp-service';
import type {
  Course,
  CourseProgressEntry,
  CreateCourseData,
  UpdateCourseData,
  LogCourseProgressData,
} from '@/lib/types';

export class CourseService {
  /**
   * Creates a new course
   */
  static async createCourse(data: CreateCourseData): Promise<Course> {
    return await prisma.course.create({
      data: {
        title: data.title,
        platform: data.platform,
        url: data.url,
        total_units: data.total_units,
        category: data.category,
        description: data.description,
        tags: data.tags || [],
      },
    });
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
    const where: {
      status?: 'backlog' | 'learning' | 'finished';
      OR?: Array<{
        title?: { contains: string; mode: 'insensitive' };
        description?: { contains: string; mode: 'insensitive' };
        platform?: { contains: string; mode: 'insensitive' };
      }>;
      tags?: { hasSome: string[] };
      platform?: { contains: string; mode: 'insensitive' };
    } = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { platform: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters?.tags && filters.tags.length > 0) {
      where.tags = { hasSome: filters.tags };
    }

    if (filters?.platform) {
      where.platform = { contains: filters.platform, mode: 'insensitive' };
    }

    return await prisma.course.findMany({
      where,
      orderBy: { updated_at: 'desc' },
    });
  }

  /**
   * Gets a course by ID
   */
  static async getCourseById(id: string): Promise<Course | null> {
    return await prisma.course.findUnique({
      where: { id },
    });
  }

  /**
   * Updates a course
   */
  static async updateCourse(
    id: string,
    data: UpdateCourseData
  ): Promise<Course> {
    return await prisma.course.update({
      where: { id },
      data,
    });
  }

  /**
   * Deletes a course
   */
  static async deleteCourse(id: string): Promise<void> {
    await prisma.course.delete({
      where: { id },
    });
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
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

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

    // Create progress entry
    await prisma.courseProgressEntry.create({
      data: {
        course_id: courseId,
        units_delta: data.units_delta,
        notes: data.notes,
      },
    });

    // Update course progress
    const newCompletedUnits = course.completed_units + data.units_delta;
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        completed_units: newCompletedUnits,
        status:
          newCompletedUnits >= course.total_units ? 'finished' : 'learning',
        started_at: course.started_at || new Date(),
        finished_at:
          newCompletedUnits >= course.total_units ? new Date() : undefined,
      },
    });

    // Calculate XP with focus boost
    const sessionXP = XPService.calculateCourseSessionXP(
      data.units_delta,
      isInFocus
    );
    const finishBonus =
      newCompletedUnits >= course.total_units
        ? XPService.calculateCourseFinishBonus(course.total_units)
        : 0;
    const totalXP = sessionXP + finishBonus;
    const isFinished = newCompletedUnits >= course.total_units;

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
    const result = await prisma.courseProgressEntry.aggregate({
      _sum: {
        units_delta: true,
      },
    });

    return result._sum.units_delta || 0;
  }

  /**
   * Gets courses by status
   */
  static async getCoursesByStatus(
    status: 'backlog' | 'learning' | 'finished'
  ): Promise<Course[]> {
    return await prisma.course.findMany({
      where: { status },
      orderBy: { updated_at: 'desc' },
    });
  }

  /**
   * Gets learning progress for a course
   */
  static async getCourseProgress(
    courseId: string
  ): Promise<CourseProgressEntry[]> {
    return await prisma.courseProgressEntry.findMany({
      where: { course_id: courseId },
      orderBy: { created_at: 'asc' },
    });
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
    return await prisma.course.findMany({
      where: {
        status: 'learning',
        completed_units: { gt: 0 },
      },
      orderBy: { updated_at: 'desc' },
    });
  }

  /**
   * Gets courses by platform
   */
  static async getCoursesByPlatform(platform: string): Promise<Course[]> {
    return await prisma.course.findMany({
      where: { platform: { contains: platform, mode: 'insensitive' } },
      orderBy: { updated_at: 'desc' },
    });
  }

  /**
   * Gets unique platforms
   */
  static async getUniquePlatforms(): Promise<string[]> {
    const courses = await prisma.course.findMany({
      where: { platform: { not: null } },
      select: { platform: true },
    });

    const platforms = courses.map(
      (c: { platform: string | null }) => c.platform
    );
    return platforms.filter(
      (platform: string | null): platform is string => platform !== null
    );
  }
}
