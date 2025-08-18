import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { title, xp, type, category, done } = body || {};

  try {
    const updated = await prisma.quest.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(xp !== undefined ? { xp } : {}),
        ...(type !== undefined ? { type } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(done !== undefined ? { done } : {}),
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { title, xp, type, category, done } = body || {};

  try {
    const updated = await prisma.quest.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(xp !== undefined ? { xp } : {}),
        ...(type !== undefined ? { type } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(done !== undefined ? { done } : {}),
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.quest.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
