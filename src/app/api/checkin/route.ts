import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

function todayDateString(): string {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export async function POST() {
  const state = await prisma.appState.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  const today = todayDateString();
  const last = state.last_check_in
    ? state.last_check_in.toISOString().slice(0, 10)
    : null;

  if (last === today) {
    return NextResponse.json({
      streak: state.streak,
      last_check_in: state.last_check_in,
      changed: false,
    });
  }

  const updated = await prisma.appState.update({
    where: { id: 1 },
    data: { streak: state.streak + 1, last_check_in: new Date(today) },
  });

  return NextResponse.json({
    streak: updated.streak,
    last_check_in: updated.last_check_in,
    changed: true,
  });
}
