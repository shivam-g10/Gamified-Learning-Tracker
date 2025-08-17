import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as
      | 'backlog'
      | 'learning'
      | 'finished'
      | undefined;
    const search = searchParams.get('search') || undefined;
    const tags = searchParams.get('tags')?.split(',') || undefined;
    const platform = searchParams.get('platform') || undefined;

    const where: Record<string, unknown> = {};
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { platform: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }
    
    if (platform) {
      where.platform = { contains: platform, mode: 'insensitive' };
    }

    const courses = await prisma.course.findMany({
      where,
      orderBy: { updated_at: 'desc' },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, platform, url, total_units, description, category, tags } =
      body;

    // Validation
    if (
      !title ||
      typeof total_units !== 'number' ||
      total_units < 0 ||
      !category
    ) {
      return NextResponse.json(
        {
          error:
            'Invalid payload. Title, total_units, and category are required.',
        },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        title,
        platform,
        url,
        total_units,
        category,
        description,
        tags: tags || [],
        completed_units: 0,
        status: 'backlog',
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error('Failed to create course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
