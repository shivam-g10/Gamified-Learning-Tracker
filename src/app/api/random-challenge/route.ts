import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const quests = await prisma.quest.findMany({ where: { done: false } });
  if (quests.length === 0) return NextResponse.json(null);
  const idx = Math.floor(Math.random() * quests.length);
  return NextResponse.json(quests[idx]);
}
