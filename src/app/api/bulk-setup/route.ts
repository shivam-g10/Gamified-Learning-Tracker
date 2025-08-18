import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    if (!type || !data || !Array.isArray(data)) {
      return NextResponse.json(
        { error: 'Invalid payload. Expected type and data array.' },
        { status: 400 }
      );
    }

    let result;
    let count = 0;

    switch (type) {
      case 'quests':
        // Clear existing quests first
        await prisma.quest.deleteMany({});
        
        // Create new quests
        result = await prisma.quest.createMany({
          data: data.map((quest: { title: string; xp: number; type: 'topic' | 'project' | 'bonus'; category: string; done?: boolean }) => ({
            title: quest.title,
            xp: quest.xp,
            type: quest.type,
            category: quest.category,
            done: quest.done || false,
          })),
        });
        count = result.count;
        break;

      case 'books':
        // Clear existing books first
        await prisma.book.deleteMany({});
        
        // Create new books
        result = await prisma.book.createMany({
          data: data.map((book: { title: string; author?: string; total_pages?: number; current_page?: number; status?: 'backlog' | 'reading' | 'finished'; description?: string; category?: string; tags?: string[] }) => ({
            title: book.title,
            author: book.author,
            total_pages: book.total_pages || 0,
            current_page: book.current_page || 0,
            status: book.status || 'backlog',
            description: book.description,
            category: book.category || 'Uncategorized',
            tags: book.tags || [],
          })),
        });
        count = result.count;
        break;

      case 'courses':
        // Clear existing courses first
        await prisma.course.deleteMany({});
        
        // Create new courses
        result = await prisma.course.createMany({
          data: data.map((course: { title: string; platform?: string; url?: string; total_units?: number; completed_units?: number; status?: 'backlog' | 'learning' | 'finished'; description?: string; category?: string; tags?: string[] }) => ({
            title: course.title,
            platform: course.platform,
            url: course.url,
            total_units: course.total_units || 0,
            completed_units: course.completed_units || 0,
            status: course.status || 'backlog',
            description: course.description,
            category: course.category || 'Uncategorized',
            tags: course.tags || [],
          })),
        });
        count = result.count;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid type. Must be one of: quests, books, courses' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully created ${count} ${type}`,
      count,
      type,
    });

  } catch (error) {
    console.error('Bulk setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    if (!type) {
      return NextResponse.json(
        { error: 'Type parameter is required' },
        { status: 400 }
      );
    }

    let sampleData;

    switch (type) {
      case 'quests':
        sampleData = [
          {
            title: 'Learn React Hooks',
            xp: 100,
            type: 'topic',
            category: 'Frontend Development',
            done: false,
          },
          {
            title: 'Build a Todo App',
            xp: 150,
            type: 'project',
            category: 'Frontend Development',
            done: false,
          },
          {
            title: 'Master TypeScript',
            xp: 200,
            type: 'topic',
            category: 'Programming Languages',
            done: false,
          },
          {
            title: 'Learn Next.js 15',
            xp: 180,
            type: 'topic',
            category: 'Full-Stack Development',
            done: false,
          },
          {
            title: 'Create Portfolio Website',
            xp: 250,
            type: 'project',
            category: 'Web Development',
            done: false,
          },
        ];
        break;

      case 'books':
        sampleData = [
          {
            title: 'Clean Code',
            author: 'Robert C. Martin',
            total_pages: 464,
            current_page: 0,
            status: 'backlog',
            description: 'A handbook of agile software craftsmanship',
            category: 'Software Engineering',
            tags: ['programming', 'clean-code', 'best-practices'],
          },
          {
            title: 'Design Patterns',
            author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
            total_pages: 416,
            current_page: 0,
            status: 'backlog',
            description: 'Elements of Reusable Object-Oriented Software',
            category: 'Software Engineering',
            tags: ['design-patterns', 'object-oriented', 'architecture'],
          },
          {
            title: 'The Pragmatic Programmer',
            author: 'Andrew Hunt, David Thomas',
            total_pages: 352,
            current_page: 0,
            status: 'backlog',
            description: 'Your journey to mastery',
            category: 'Software Engineering',
            tags: ['programming', 'career', 'best-practices'],
          },
          {
            title: 'Refactoring',
            author: 'Martin Fowler',
            total_pages: 448,
            current_page: 0,
            status: 'backlog',
            description: 'Improving the Design of Existing Code',
            category: 'Software Engineering',
            tags: ['refactoring', 'code-quality', 'maintenance'],
          },
        ];
        break;

      case 'courses':
        sampleData = [
          {
            title: 'Complete React Developer',
            platform: 'Udemy',
            url: 'https://udemy.com/react-complete-guide',
            total_units: 20,
            completed_units: 0,
            status: 'backlog',
            description: 'Learn React from scratch to advanced concepts',
            category: 'Frontend Development',
            tags: ['react', 'javascript', 'frontend'],
          },
          {
            title: 'Node.js Complete Guide',
            platform: 'Udemy',
            url: 'https://udemy.com/nodejs-complete-guide',
            total_units: 25,
            completed_units: 0,
            status: 'backlog',
            description: 'Master Node.js backend development',
            category: 'Backend Development',
            tags: ['nodejs', 'javascript', 'backend'],
          },
          {
            title: 'Advanced TypeScript',
            platform: 'Frontend Masters',
            url: 'https://frontendmasters.com/courses/advanced-typescript',
            total_units: 15,
            completed_units: 0,
            status: 'backlog',
            description: 'Deep dive into TypeScript advanced features',
            category: 'Programming Languages',
            tags: ['typescript', 'programming', 'advanced'],
          },
          {
            title: 'System Design Interview',
            platform: 'Educative',
            url: 'https://educative.io/system-design-interview',
            total_units: 30,
            completed_units: 0,
            status: 'backlog',
            description: 'Prepare for system design interviews',
            category: 'System Design',
            tags: ['system-design', 'architecture', 'interview'],
          },
        ];
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid type. Must be one of: quests, books, courses' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      type,
      sampleData,
      count: sampleData.length,
    });

  } catch (error) {
    console.error('Sample data error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
