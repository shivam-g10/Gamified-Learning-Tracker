import { NextRequest, NextResponse } from 'next/server';
import { FocusService } from '@/services/focus-service';
import type { FocusState } from '@/lib/types';

export async function GET() {
  try {
    const focusState = await FocusService.getFocusState();
    return NextResponse.json(focusState);
  } catch (error) {
    console.error('Failed to get focus state:', error);
    return NextResponse.json(
      { error: 'Failed to get focus state' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { type, id, action } = await request.json();

    if (!type || !['quest', 'book', 'course'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid focus type' },
        { status: 400 }
      );
    }

    let focusState: FocusState;

    if (action === 'remove') {
      focusState = await FocusService.removeFocus(type);
    } else {
      if (!id) {
        return NextResponse.json(
          { error: 'ID is required for setting focus' },
          { status: 400 }
        );
      }
      focusState = await FocusService.setFocus(type, id);
    }

    return NextResponse.json(focusState);
  } catch (error) {
    console.error('Failed to update focus:', error);
    return NextResponse.json(
      { error: 'Failed to update focus' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const focusState = await FocusService.clearAllFocus();
    return NextResponse.json(focusState);
  } catch (error) {
    console.error('Failed to clear focus:', error);
    return NextResponse.json(
      { error: 'Failed to clear focus' },
      { status: 500 }
    );
  }
}
