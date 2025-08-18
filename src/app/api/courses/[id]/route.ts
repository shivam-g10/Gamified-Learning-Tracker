import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withUserAuth } from '@/lib/auth-utils';
import { Result, succeed, fail } from '@/lib/result';

export const dynamic = 'force-dynamic';

async function getCourse(
  userId: string,
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Result<NextResponse, string>> {
  try {
    const { id } = await params;
    const course = await prisma.course.findUnique({
      where: { id, user_id: userId },
    });

    if (!course) {
      return fail('Course not found');
    }

    return succeed(NextResponse.json(course));
  } catch (error) {
    console.error('Error fetching course:', error);
    return fail('Failed to fetch course');
  }
}

async function updateCourse(
  userId: string,
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Result<NextResponse, string>> {
  try {
    const { id } = await params;
    const body = await req.json();

    // Verify the course belongs to the user
    const existingCourse = await prisma.course.findUnique({
      where: { id, user_id: userId },
    });

    if (!existingCourse) {
      return fail('Course not found');
    }

    const course = await prisma.course.update({
      where: { id, user_id: userId },
      data: body,
    });

    return succeed(NextResponse.json(course));
  } catch (error) {
    console.error('Error updating course:', error);
    return fail('Failed to update course');
  }
}

async function deleteCourse(
  userId: string,
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Result<NextResponse, string>> {
  try {
    const { id } = await params;

    // Verify the course belongs to the user
    const existingCourse = await prisma.course.findUnique({
      where: { id, user_id: userId },
    });

    if (!existingCourse) {
      return fail('Course not found');
    }

    await prisma.course.delete({
      where: { id, user_id: userId },
    });

    return succeed(NextResponse.json({ success: true }));
  } catch (error) {
    console.error('Error deleting course:', error);
    return fail('Failed to delete course');
  }
}

export const GET = withUserAuth(getCourse);
export const PATCH = withUserAuth(updateCourse);
export const PUT = withUserAuth(updateCourse);
export const DELETE = withUserAuth(deleteCourse);
