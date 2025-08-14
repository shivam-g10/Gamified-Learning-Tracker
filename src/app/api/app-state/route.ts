import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function ensureAppState() {
  const existing = await prisma.appState.findUnique({ where: { id: 1 } });
  if (existing) return existing;
  return prisma.appState.create({
    data: {
      id: 1,
      streak: 0,
      focus: [],
      last_check_in: null,
    },
  });
}

export async function GET() {
  const state = await ensureAppState();
  return NextResponse.json(state);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { streak, last_check_in, focus } = body || {};

  // Validate focus array
  if (focus && Array.isArray(focus) && focus.length > 3) {
    return NextResponse.json({ error: 'Focus max 3' }, { status: 400 });
  }

  const data: Partial<{
    streak: number;
    last_check_in: Date | null;
    focus: string[];
  }> = {};

  if (typeof streak === 'number') data.streak = streak;
  if (last_check_in === null) data.last_check_in = null;
  if (typeof last_check_in === 'string')
    data.last_check_in = new Date(last_check_in);

  // Ensure focus is always an array (even if empty)
  if (Array.isArray(focus)) {
    data.focus = focus;
  } else if (focus === null || focus === undefined) {
    data.focus = [];
  }

  const updated = await prisma.appState.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, streak: 0, focus: [], last_check_in: null, ...data },
  });

  return NextResponse.json(updated);
}
