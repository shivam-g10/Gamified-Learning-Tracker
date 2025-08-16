import { NextRequest, NextResponse } from 'next/server';
import { CourseService } from '@/services/course-service';
import { FocusService } from '@/services/focus-service';
import { XPService } from '@/services/xp-service';

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
    const course = await CourseService.getCourseById(id);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if course is in focus for XP boost
    const focusState = await FocusService.getFocusState();
    const isInFocus = focusState.course?.id === id;

    // Log progress and calculate XP with focus boost
    const result = await CourseService.logProgress(
      id,
      {
        units_delta,
        notes: notes || null,
      },
      isInFocus
    );

    // Calculate focus boost details for response
    const baseSessionXP = XPService.calculateCourseSessionXP(
      units_delta,
      false
    );
    const focusBoostXP = isInFocus
      ? result.xpEarned - baseSessionXP - result.finishBonus
      : 0;

    return NextResponse.json({
      success: true,
      course: result.course,
      xpEarned: result.xpEarned,
      sessionXP: baseSessionXP,
      focusBoostXP,
      finishBonus: result.finishBonus,
      isFinished: result.isFinished,
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
