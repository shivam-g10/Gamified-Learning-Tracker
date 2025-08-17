import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { units_delta, notes } = body;

    if (!units_delta || typeof units_delta !== 'number' || units_delta <= 0) {
      return NextResponse.json(
        { error: 'Valid units delta is required' },
        { status: 400 }
      );
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id },
    });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if course is in focus for XP boost
    const focusSlot = await prisma.focusSlot.findFirst();
    const isInFocus = focusSlot?.course_id === id;

    // Calculate XP
    const baseSessionXP = units_delta * 15; // 15 XP per unit
    const focusBoostXP = isInFocus ? Math.floor(baseSessionXP * 0.5) : 0; // 50% boost if in focus
    const sessionXP = baseSessionXP + focusBoostXP;

    // Check if course is finished
    const newCompletedUnits = course.completed_units + units_delta;
    const isFinished = newCompletedUnits >= course.total_units;
    const finishBonus = isFinished ? 150 : 0; // 150 XP bonus for finishing

    const totalXP = sessionXP + finishBonus;

    // Log progress entry
    await prisma.courseProgressEntry.create({
      data: {
        course_id: id,
        units_delta,
        notes: notes || null,
        xp_earned: totalXP,
      },
    });

    // Update course completed units
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        completed_units: newCompletedUnits,
        status: isFinished ? 'finished' : 'learning',
        updated_at: new Date(),
      },
    });

    // Update app state XP
    const appState = await prisma.appState.findFirst();
    if (appState) {
      await prisma.appState.update({
        where: { id: appState.id },
        data: {
          total_xp: appState.total_xp + totalXP,
        },
      });
    }

    return NextResponse.json({
      success: true,
      course: updatedCourse,
      xpEarned: totalXP,
      sessionXP: baseSessionXP,
      focusBoostXP,
      finishBonus,
      isFinished,
      isInFocus,
      unitsCompleted: units_delta,
    });
  } catch (error) {
    console.error('Error logging course progress:', error);
    return NextResponse.json(
      { error: 'Failed to log course progress' },
      { status: 500 }
    );
  }
}
