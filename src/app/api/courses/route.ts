import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';
import { withUserAuth } from '../../../lib/auth-utils';
import { Result, succeed, fail } from '../../../lib/result';

export const dynamic = 'force-dynamic';

async function getCourses(
  userId: string,
  req: NextRequest
): Promise<Result<NextResponse, string>> {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const category = searchParams.get('category') || undefined;

    const courses = await prisma.course.findMany({
      where: {
        user_id: userId,
        AND: [
          search
            ? {
                OR: [
                  { title: { contains: search, mode: 'insensitive' } },
                  { platform: { contains: search, mode: 'insensitive' } },
                  { category: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
          status
            ? { status: status as 'backlog' | 'learning' | 'finished' }
            : {},
          category
            ? { category: { equals: category, mode: 'insensitive' } }
            : {},
        ],
      },
      orderBy: { created_at: 'desc' },
    });

    return succeed(NextResponse.json(courses));
  } catch (error) {
    console.error('Error fetching courses:', error);
    return fail('Failed to fetch courses');
  }
}

async function createCourse(
  userId: string,
  req: NextRequest
): Promise<Result<NextResponse, string>> {
  try {
    const body = await req.json();
    const { title, platform, url, total_units, description, category, tags } =
      body || {};

    if (!title) {
      return fail('Title is required');
    }

    const course = await prisma.course.create({
      data: {
        title,
        platform,
        url,
        total_units: total_units || 0,
        description,
        category: category || 'Uncategorized',
        tags: tags || [],
        user_id: userId,
      },
    });

    return succeed(NextResponse.json(course, { status: 201 }));
  } catch (error) {
    console.error('Error creating course:', error);
    return fail('Failed to create course');
  }
}

export const GET = withUserAuth(getCourses);
export const POST = withUserAuth(createCourse);
