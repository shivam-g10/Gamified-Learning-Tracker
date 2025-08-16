import { NextRequest, NextResponse } from 'next/server';
import { CourseService } from '@/services/course-service';

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

    const filters = {
      status,
      search,
      tags,
      platform,
    };

    const courses = await CourseService.getCourses(filters);
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

    const course = await CourseService.createCourse({
      title,
      platform,
      url,
      total_units,
      category,
      description,
      tags,
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
