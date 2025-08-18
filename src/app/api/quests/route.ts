import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';
import { withUserAuth } from '../../../lib/auth-utils';
import { Result, succeed, fail } from '../../../lib/result';

export const dynamic = 'force-dynamic';

async function getQuests(
  userId: string,
  req: NextRequest
): Promise<Result<NextResponse, string>> {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const type = searchParams.get('type') || undefined;
    const category = searchParams.get('category') || undefined;
    const doneParam = searchParams.get('done');
    const done = doneParam === null ? undefined : doneParam === 'true';

    const quests = await prisma.quest.findMany({
      where: {
        user_id: userId,
        AND: [
          search
            ? {
                OR: [
                  { title: { contains: search, mode: 'insensitive' } },
                  { category: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
          type ? { type: type as 'topic' | 'project' | 'bonus' } : {},
          category
            ? { category: { equals: category, mode: 'insensitive' } }
            : {},
          done !== undefined ? { done } : {},
        ],
      },
      orderBy: { created_at: 'desc' },
    });

    return succeed(NextResponse.json(quests));
  } catch (error) {
    console.error('Error fetching quests:', error);
    return fail('Failed to fetch quests');
  }
}

async function createQuest(
  userId: string,
  req: NextRequest
): Promise<Result<NextResponse, string>> {
  try {
    const body = await req.json();
    const { title, description, xp, type, category } = body || {};

    if (!title || typeof xp !== 'number' || xp < 0 || !type || !category) {
      return fail('Invalid payload');
    }

    const quest = await prisma.quest.create({
      data: {
        title,
        description,
        xp,
        type,
        category,
        user_id: userId,
      },
    });

    return succeed(NextResponse.json(quest, { status: 201 }));
  } catch (error) {
    console.error('Error creating quest:', error);
    return fail('Failed to create quest');
  }
}

export const GET = withUserAuth(getQuests);
export const POST = withUserAuth(createQuest);
