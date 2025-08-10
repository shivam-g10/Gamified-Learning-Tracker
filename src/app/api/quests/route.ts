import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || undefined;
  const type = searchParams.get('type') || undefined;
  const category = searchParams.get('category') || undefined;
  const doneParam = searchParams.get('done');
  const done = doneParam === null ? undefined : doneParam === 'true';

  const quests = await prisma.quest.findMany({
    where: {
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
        category ? { category: { equals: category, mode: 'insensitive' } } : {},
        done !== undefined ? { done } : {},
      ],
    },
    orderBy: { created_at: 'desc' },
  });

  return NextResponse.json(quests);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, xp, type, category } = body || {};
  if (!title || typeof xp !== 'number' || xp < 0 || !type || !category) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const quest = await prisma.quest.create({
    data: { title, xp, type, category },
  });
  return NextResponse.json(quest, { status: 201 });
}


